pipeline {
    agent any
    
    environment {
        REGISTRY = 'ecommercewestacr2025.azurecr.io'
        GIT_COMMIT_SHORT = sh(
            script: "printf \$(git rev-parse --short HEAD)",
            returnStdout: true
        ).trim()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "🚀 Building commit: ${env.GIT_COMMIT_SHORT}"
                echo "📂 Listing project files..."
                sh 'ls -la'
                sh 'pwd'
            }
        }
        
        stage('Verify Structure') {
            steps {
                echo "🔍 Checking project structure..."
                sh '''
                    echo "=== Applications folder ==="
                    ls -la applications/ || echo "No applications folder"
                    
                    echo "=== Kubernetes manifests ==="
                    ls -la kubernetes/ || ls -la k8s-manifests/ || echo "No k8s folder"
                    
                    echo "=== Infrastructure ==="
                    ls -la infrastructure/ || echo "No infrastructure folder"
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo "✅ GitHub integration working!"
                echo "✅ Pipeline executed successfully!"
                echo ""
                echo "📌 Next steps:"
                echo "1. Configure Kubernetes cloud in Jenkins"
                echo "2. Enable Kaniko builds"
                echo "3. Deploy to AKS cluster"
            }
        }
    }
    
    post {
        success {
            echo '🎉 Test pipeline completed successfully!'
            echo '🔧 Ready to configure Kubernetes cloud for production builds'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo '🧹 Cleanup complete'
        }
    }
}
