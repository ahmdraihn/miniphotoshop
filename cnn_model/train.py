import os
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Subset
from model import CustomCNN

def train_model():
    print("=== Memulai Pipeline Latihan CNN dari Nol ===")
    
    # 1. Device configuration
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Menggunakan Device: {device}")
    
    # 2. Preprocessing & Augmentation
    transform_train = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
    ])
    
    transform_test = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
    ])
    
    # 3. Load CIFAR-10 Dataset
    print("Mengunduh/Memuat Dataset CIFAR-10...")
    train_dataset_full = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform_train)
    test_dataset_full = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform_test)
    
    # Gunakan subset optimal (12.000 data latih, 2.400 data validasi) untuk training cepat di CPU
    train_indices = list(range(12000))
    test_indices = list(range(2400))
    
    train_dataset = Subset(train_dataset_full, train_indices)
    test_dataset = Subset(test_dataset_full, test_indices)
    
    train_loader = DataLoader(train_dataset, batch_size=128, shuffle=True, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=128, shuffle=False, num_workers=0)
    
    # 4. Initialize Model, Loss, and Optimizer
    model = CustomCNN(num_classes=10).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # 5. Training Loop
    epochs = 6
    print(f"Mulai melatih model Custom CNN selama {epochs} epochs...")
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for i, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
        train_acc = 100.0 * correct / total
        epoch_loss = running_loss / len(train_loader)
        
        # Validation Step
        model.eval()
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()
        
        val_acc = 100.0 * val_correct / val_total
        print(f"Epoch [{epoch+1}/{epochs}] - Loss: {epoch_loss:.4f} - Train Acc: {train_acc:.2f}% - Val Acc: {val_acc:.2f}%")
        
    # 6. Save Model Weights
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(base_dir, 'saved_model'), exist_ok=True)
    save_path = os.path.join(base_dir, 'saved_model', 'model.pth')
    torch.save(model.state_dict(), save_path)
    print(f"Model berhasil dilatih dan disimpan di: {save_path}")

if __name__ == '__main__':
    train_model()
