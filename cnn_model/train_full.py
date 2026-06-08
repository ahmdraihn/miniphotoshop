import os
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from model import CustomCNN

def train_model():
    print("=== Training CNN Penuh — Target Akurasi ≥70% ===")
    
    # 1. Device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Menggunakan Device: {device}")
    if device.type == 'cuda':
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    
    # 2. Augmentasi lebih kaya untuk generalisasi yang lebih baik
    transform_train = transforms.Compose([
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(15),
        transforms.RandomCrop(32, padding=4),         # crop kecil agar model lebih robust
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
    ])
    
    transform_test = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
    ])
    
    # 3. Load FULL CIFAR-10 Dataset (50.000 train, 10.000 test)
    print("Memuat Dataset CIFAR-10 penuh (50.000 gambar)...")
    train_dataset = torchvision.datasets.CIFAR10(
        root='./data', train=True, download=True, transform=transform_train
    )
    test_dataset = torchvision.datasets.CIFAR10(
        root='./data', train=False, download=True, transform=transform_test
    )
    
    train_loader = DataLoader(train_dataset, batch_size=128, shuffle=True, num_workers=0)
    test_loader  = DataLoader(test_dataset,  batch_size=128, shuffle=False, num_workers=0)
    
    print(f"Data latih: {len(train_dataset):,} gambar")
    print(f"Data validasi: {len(test_dataset):,} gambar")
    
    # 4. Model, Loss, Optimizer
    model     = CustomCNN(num_classes=10).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Learning rate scheduler: turunkan LR setelah epoch 10 & 15
    scheduler = optim.lr_scheduler.MultiStepLR(optimizer, milestones=[10, 15], gamma=0.1)
    
    # 5. Hitung total parameter model
    total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Total parameter model: {total_params:,}")
    
    # 6. Training Loop
    epochs = 20
    best_val_acc = 0.0
    base_dir = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(base_dir, 'saved_model', 'model.pth')
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    print(f"\nMulai melatih selama {epochs} epochs...\n")
    print(f"{'Epoch':>6} | {'Loss':>8} | {'Train Acc':>10} | {'Val Acc':>10} | {'LR':>10}")
    print("-" * 55)
    
    for epoch in range(epochs):
        # --- Training Phase ---
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss    = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total   += labels.size(0)
            correct += predicted.eq(labels).sum().item()
        
        train_acc  = 100.0 * correct / total
        epoch_loss = running_loss / len(train_loader)
        current_lr = optimizer.param_groups[0]['lr']
        
        # --- Validation Phase ---
        model.eval()
        val_correct = 0
        val_total   = 0
        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(device), labels.to(device)
                outputs        = model(images)
                _, predicted   = outputs.max(1)
                val_total   += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()
        
        val_acc = 100.0 * val_correct / val_total
        
        print(f"{epoch+1:>6}/{epochs} | {epoch_loss:>8.4f} | {train_acc:>9.2f}% | {val_acc:>9.2f}% | {current_lr:>10.6f}")
        
        # Simpan model terbaik
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), save_path)
            print(f"         ✓ Model terbaik disimpan! Val Acc: {val_acc:.2f}%")
        
        scheduler.step()
    
    print(f"\n{'='*55}")
    print(f"Training selesai!")
    print(f"Akurasi validasi terbaik: {best_val_acc:.2f}%")
    print(f"Model disimpan di: {save_path}")

if __name__ == '__main__':
    train_model()
