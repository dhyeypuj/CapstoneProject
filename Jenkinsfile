pipeline {
    agent any
    stages {
        stage('Fetch Code') {
            steps {
                checkout scm
                echo 'Code successfully pulled from GitHub!'
            }
        }
        stage('Docker Build') {
            steps {
                // This simulates the Docker build stage for your presentation
                echo 'Building Docker container for NeuralGuard...'
                sh 'docker --version' 
            }
        }
        stage('Email Alert') {
            steps {
                echo 'Sending automated build notification to the team...'
                emailext (
                    subject: "NeuralGuard CI/CD: Build ${currentBuild.currentResult}",
                    body: "The build was successful! Check the Stage View here: ${env.BUILD_URL}",
                    to: "disha.sharma2607@gmail.com, dhyeypuj@gmail.com"
                )
            }
        }
    }
}