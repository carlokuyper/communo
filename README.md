

<!-- Repository Information & Links-->
<br />

<!-- ![GitHub repo size](https://img.shields.io/github/repo-size/MikeMaynard14/termoneexample)
![GitHub watchers](https://img.shields.io/github/watchers/MikeMaynard14/termoneexample)
![GitHub language count](https://img.shields.io/github/languages/count/MikeMaynard14/termoneexample)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/MikeMaynard14/termoneexample) -->

<!-- HEADER SECTION -->
<h5 align="center" style="padding:0;margin:0;">Carlo Kuyper</h5>
<h5 align="center" style="padding:0;margin:0;">180145</h5>
<h6 align="center">Honours 2022-2023</h6>
</br>
<p align="center">

  <a href="https://github.com/carlokuyper/AstronomicalCode-">
    <img src="https://github.com/carlokuyper/comuno/blob/main/readme/logo-no-white.png" alt="Logo" width="160" height="160">
  </a>
  
  <h3 align="center">Communo</h3>

  <p align="center">
    This project investigates how Natural Language Processing (NLP) and Sentiment Analysis can enrich messages with emotion and context, thereby enhancing communication and reducing misunderstandings. This project aims to bridge the gap between written communication and face-to-face interaction by infusing text-based messages with emotional cues and contextual information. <br>
        
   <br />
   <br />
    ·
    <a href="https://github.com/carlokuyper/comuno/issues">Report Bug</a>
    ·
    <a href="https://github.com/carlokuyper/scomuno/issues">Request Feature</a>
</p>
<!-- TABLE OF CONTENTS -->

## Table of Contents

* [About the Project](#about-the-project)
  * [Project Description](#project-description)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [How to install](#how-to-install)
* [Features and Functionality](#features-and-functionality)
* [Concept Process](#concept-process)
   * [Ideation](#ideation)
   * [Wireframes](#wireframes)
   * [Custom UI](#user-flow)
* [Development Process](#development-process)
   * [Implementation Process](#implementation-process)
        * [Highlights](#highlights)
        * [Challenges](#challenges)
   * [Future Implementation](#peer-reviews)
* [Final Outcome](#final-outcome)
    * [Mockups](#mockups)
    * [Video Demonstration](#video-demonstration)
* [Conclusion](#conclusion)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!--PROJECT DESCRIPTION-->
## About the Project
<!-- header image of project -->
![image1](https://github.com/carlokuyper/comuno/blob/main/readme/mockup/807.png)

### Project Description

Unlock the full spectrum of human emotions with Communo. Explore our journey of enhancing text-based  communication for richer, more nuanced conversations.

### Built With

* [ReactNative](https://reactnative.dev/)
* [FireBase](https://console.firebase.google.com/u/0/)
* [OpenAI](https://openai.com/)

<!-- GETTING STARTED -->
<!-- Make sure to add appropriate information about what prerequesite technologies the user would need and also the steps to install your project on their own mashines -->
## Getting Started

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Strong JavaScript skills. [VS Code](https://code.visualstudio.com/) or similar code editors. The [GitHub Desktop](https://desktop.github.com/) program will also be required. 

### How to install

### Installation
Here are a couple of ways to clone this repo:

1. GitHub Desktop </br>
Enter `https://github.com/carlokuyper/comuno.git` into the URL field and press the `Clone` button.

2. Clone Repository </br>
Run the following in the command-line to clone the project:
   ```sh
   git clone https://github.com/carlokuyper/comuno
   ```
    Open `Software` and select `File | Open...` from the menu. Select cloned directory and press `Open` button

3. Open the terminal and navigate to the main folder (Communo) </br>
  Run the following in the command-line to install all the required dependencies:
   ```sh
   npm i
   ```

4. After the installation is complete run the following comands   </br>
   In the terminal run:
   ```sh
   npm start
   ```

5. An API key at OpenAi is required


<!-- FEATURES AND FUNCTIONALITY-->
<!-- You can add the links to all of your imagery at the bottom of the file as references -->
## Features and Functionality

<!-- note how you can use your gitHub link. Just make a path to your assets folder -->
![image2](https://github.com/carlokuyper/comuno/blob/main/readme/mockup/801.png)

### Input Field

The entire website is build to help the user. It features multiple aspects to enhance text-based communication. 

The input field is one of the primary features and arguably the most important, it is the key that starts the entire process of adding nuances to each conversation. As soon as a user started to type, the text analysis would start. The text analysis employed NLP and Sentiment Analysis techniques, such as delimiters, tokenizers, stemmers, and taggers, to breakdown and understand the message’s structure and context. The breakdown and analysis are two of the most important features of the application, as they provide the user with real-time feedback on how a message will be interpreted by other users. This is what activates all other app features, such as the message bubble and conversation summary. 

![image3](https://github.com/carlokuyper/comuno/blob/main/readme/mockup/P6YSG411.png)

### Chat Bubble

When the user clicks the send button, the displayed data is sent to the server, and the information is displayed to the user via the chat bubbles. The chat bubble is probably the most simplistic in terms of coding, but to effectively communicate and add nuances to a conversation, the added information must be displayed to the user in an effective manner. This posed a lot of challenges in creating an effective means of communicating the information in a way that wasn’t overwhelming to the user. 

![image4](https://github.com/carlokuyper/comuno/blob/main/readme/mockup/65975.png)

### Summary Screen

The conversation summary panel was the very last feature that was added to the application. The summary of the conversation offers a condensed overview of what was discussed. Users are able to rapidly assess the general tone of voice as well as the general topic of a discussion thanks to this function. This feature can be viewed as both positive and negative. It can allow a user to see that this is a good conversation and know that your relationship with the user is positive, but when the conversation has a negative connection, it can cause the users’ relationship to separate or cause users to attempt to repair their relationship. These outcomes are dependent on the user’s actions.

![image5](https://github.com/carlokuyper/comuno/blob/main/readme/mockup/8.png)

### Inspiration

Initial Wireframe

![image6](https://github.com/carlokuyper/comuno/blob/main/readme/QRCodes/DesignSystem.png)

### Inspiration

Initial Wireframe

![image7](https://github.com/carlokuyper/comuno/blob/main/readme/QRCodes/LowFedelityWireframe.png)

### Final UI

Final  Wireframe

![image8](https://github.com/carlokuyper/comuno/blob/main/readme/QRCodes/HighFedelityWireframe.png)


<!-- DEVELOPMENT PROCESS -->
### Coding Strategy 

Communo used React Native as its primary framework for developing the app. 
React Native is a cross-platform programming language that ensures 
compatibility with both Android and iOS devices, reducing development time and effort. This choice of framework allows for efficient and rapid development of the user interface and design. Using React Native, the development process for Communo was streamlined, allowing for faster and more efficient coding with its smooth performance. React Native has been instrumental in creating an intuitive and seamless experience for Communo users. 

### Sequential Approach
<!-- stipulate all of the functionality you included in the project -->
<!-- This is your time to shine, explain the technical nuances of your project, how did you achieve the final outcome!-->

The development of the app used a sequential approach, where the communication app was first created to allow for seamless communication between individuals, 
similar to that of WhatsApp. Afterwards, the implementation of NLP and Sentemitn Analysis was added. This approach ensured that the core features and functionality were in place before integrating more advanced elements such as NLP and 
Sentiment Analysis.

The implementation of the input field was the first step in the implementation of the additional features, as it is the primary component. After it was implemented, the text bubbles were modified to visually convey to the user the additional nuances. Last but not least, the summary screen was included to let people view the conversation 
summary. This sequential approach ensured that each stage was rigorously tested and refined before proceeding to the next. 

### Future Implementation
<!-- stipulate functionality and improvements that can be implemented in the future. -->

* Import Contacts
  Allowing users to directly import their contacts. Currently, the system is set up where you can see all users that have an account. Will also add privacy

* Additional Animation and Gesture 
  This will improve user experience.

* Additional Inputs
  Voice recognition translates spoken words into text.
  Active face recognition enables the user to influence their tone of voice with factual expression. 

* Backend Improvements  
  Adding machine learning algorithms to learn the user writing style will better analyses the data and provide greater insight.  


### Conclusion
<!-- stipulate functionality and improvements that can be implemented in the future. -->

The development of Communo and the incorporation of NLP and Sentiment Analysis was a 
profound learning experiences. Throughout the duration of this project, I delved into the realm of digital communication, examining the challenges posed by text-based conversations, which led to a deeper understanding of the role of emotions and nuances in interpersonal 
relationships. Communo, with its fusion of NLP and Sentiment Analysis, demonstrates the 
transformative power of technology in making our conversations richer and more emotionally resonant.

In the future, Communo can serve as a starting point for additional applications and studies aimed at enhancing digital interaction. Communo aims to disrupt the conventions of digital communication by bridging the gap between technology and human connection. By 
exploring new ways to facilitate meaningful conversations and foster genuine connections, Communo paves the way for a more authentic and engaging online experience. This innovative project opens doors for future advancements in communication technology, ultimately striving to create a harmonious balance between the convenience of technology and the richness of human connection.  

<!-- MOCKUPS -->
## Final Outcome

### Demonstration Video
  <a href="https://github.com/carlokuyper/comuno/blob/main/readme/demonstrationVideo.mp4">View Demo!</a>


<!-- AUTHORS -->
## Authors

* **Carlo Kuyper** - [carlokuyper](https://github.com/carlokuyper)

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.\

<!-- LICENSE -->
## Contact

* **Carlo Kuyper** - [carlokuyper@gmail.com](carlokuyper@gmail.com) 