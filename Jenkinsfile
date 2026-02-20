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
        echo 'Building Docker container for NeuralGuard...'
        bat 'docker --version' // Changed from 'sh' to 'bat' for Windows
    }
}
        stage('Email Alert') {
            steps {
                echo 'Sending automated build notification to the team...'
                emailext (
                    subject: "NeuralGuard CI/CD: Build ${currentBuild.currentResult}",
                    body: "The build was successful! Check the Stage View here: ${env.BUILD_URL}",
                    to: "disha.sharma23@st.niituniversity.in, dhyey.pujara23@st.niituniversity.in, adwitiya.sinha23@sst,niituniversity.in, akanksha.joshi23@st.niituniversity.in"
                )
            }
        }
    }
}