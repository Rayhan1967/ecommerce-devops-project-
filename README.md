# E-Commerce DevOps Project

## 📋 Project Overview
Comprehensive e-commerce microservices application demonstrating full DevOps implementation with modern tools and practices.

## 🏗️ Architecture
- **Frontend**: React.js
- **Backend Services**: Node.js microservices
- **Database**: MongoDB, PostgreSQL
- **Container**: Docker & Kubernetes
- **CI/CD**: Jenkins & GitHub Actions
- **Infrastructure**: Terraform & Ansible
- **Monitoring**: Prometheus & Grafana

## 🚀 Quick Start
## 📁 Project Structure
ecommerce-devops-project/
├── applications/ # Application source code
├── infrastructure/ # IaC configurations
├── k8s-manifests/ # Kubernetes manifests
├── helm-charts/ # Helm charts
├── ci-cd/ # CI/CD configurations
├── monitoring/ # Monitoring setup
├── docs/ # Documentation
└── scripts/ # Utility scripts

## 🛠️ Technologies Used
- **Languages**: JavaScript, Python, Bash
- **Frameworks**: React, Express.js, Node.js
- **Databases**: MongoDB, PostgreSQL, Redis
- **DevOps**: Docker, Kubernetes, Terraform, Ansible
- **CI/CD**: Jenkins, GitHub Actions, ArgoCD
- **Monitoring**: Prometheus, Grafana, ELK Stack
- **Cloud**: AWS/Azure

## 📚 Documentation
- [Architecture Overview](docs/architecture.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [API Documentation](docs/api.md)

# E-Commerce Microservices DevOps Platform

## Architecture Overview
- 4 Microservices: API Gateway, User, Product, Order Services
- 2 Databases: MongoDB, PostgreSQL  
- Container Orchestration: Kubernetes on Azure AKS
- External Access: http://4.255.47.196

## Quick Start
kubectl get pods
curl http://4.255.47.196/health

## API Endpoints
- GET /api/users/health
- GET /api/products/health
- GET /api/orders/health
- GET /api/products/
- GET /api/products/:id
- https://roadmap.sh/projects/multiservice-docker
