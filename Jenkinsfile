pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "neuralguard-app"
        RECIPIENTS = "disha.sharma2607@gmail.com, teammate1@gmail.com, teammate2@uni.edu"
    }

    stages {

        stage('Fetch Code') {
            steps {
                echo "Pulling latest code from GitHub..."
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }

    }

    post {

        success {
            emailext(
                subject: "✅ NeuralGuard CI/CD SUCCESS - Build #${env.BUILD_NUMBER}",
                body: """
                <h2 style="color:green;">Build Successful 🎉</h2>

                <b>Project:</b> NeuralGuard<br>
                <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                <b>Status:</b> ${currentBuild.currentResult}<br>
                <b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a><br>
                """,
                mimeType: 'text/html',
                to: "disha.sharma2607@gmail.com"
            )
        }

        failure {
            emailext(
                subject: "❌ NeuralGuard CI/CD FAILURE - Build #${env.BUILD_NUMBER}",
                body: """
                <h2 style="color:red;">Build Failed 🚨</h2>

                <b>Project:</b> NeuralGuard<br>
                <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                <b>Status:</b> ${currentBuild.currentResult}<br>
                <b>Check Logs:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a><br>
                """,
                mimeType: 'text/html',
                to: "${RECIPIENTS}"
            )
        }

        always {
            echo "Pipeline execution completed."
        }
    }
}