# Digital_Assistant_Client

Client for Universal Digital Assistant

**Update - We are working on upgrading this to an 'AI agent'. Integrating this into your website should automatically help LLMs like chatGPT, Claude, Gemini etc interface with your website with minimal effort. Expect to see a POC by end of October 2025**

World's first and only AI driven Open Source Digital Adoption Platform !!
Concept video: https://youtu.be/yEPGWexvpL8 

Assistant in Action: https://youtu.be/Iz2WgKY0fhc

(You will need the server too: https://github.com/Digital-Assistant/digital-assistant-server)

Telegram: https://t.me/UniDigitalAssistant
Discord: https://discord.gg/92NqDEUbxV

Preamble: The explosion of web/browser (and digital) applications has come with the problem of users having to learn how
to use each of them. This step of user learning how to navigate and use and application is a roadblock in improving
productivity. In addition, the user’s knowledge of an application/device is a constraint on his/her productivity. You do
not need to be an expert on salesforce to be a good sales person. Nonetheless, sales-people have to be trained in the
nuances of salesforce to help them become more productive. We need to make it easier for users to use applications.
Chatbots and voicebots attempt to solve this problem but they are very effort intensive, purpose built and inflexible to
our world of continuous integration. We need a self learning assistant which will adapt to both users as well as
continuously evolving applications.

Universal Digital Assistant (UDA):
UDA is a Digital Assistant which helps you accomplish tasks in any (currently) browser based application. A ‘task’ is
accomplished in an application via a sequence of clicks (and other user inputs) to achieve a particular objective.
Examples Create a new issue (in a proj. Mgmt. tool)
Show the clients with order value between ‘x’ and ‘y’ (in a sales/CRM tool)
How many sick leaves do I have? (in a HR tool) etc. UDA will translate the regular English commands into a sequence of
clicks in the application thus helping the user accomplish the task without having to become an expert in the
application. This is achieved in 2 ways:
User ‘creates’ a task by recording a sequence of clicks and labeling this sequence. Eg. Label:  “How many sick leaves do
I have” is mapped to a sequence of clicks which leads to the answer to that question. We index all the ‘clickable items’
in the application, make a graph of these items and then try to use advanced Natural Language Processing, Neural Machine
Translation and Deep Learning techniques to infer and execute the users intent.

UDA client:
UDA-client (browser extension) is the front end of our assistant. It accomplishes multiple things:
Helps user ‘record’ and ‘play’ tasks, Helps relay user’s questions to our backend ML engine and then based on the
response, guide the user in accomplishing tasks in the web application. It of course also indexes the ‘clickable
actions’ in each screen to feed to our ML backend. This is of course quite intrusive but unless we know the application
the general sequence of clicks, the assistant cannot learn.

UDA-client can be used in RPA like applications as well as test automation.

UDA-client currently works only with the chrome browser but we will be extending this to support Firefox and Edge.

We solicit and welcome comments, help, documentation in improving the client.

### Integrate as sdk into applications

1. Add the below Script in head as first script tag
    ```
    <script src="https://udan-sdk.nistapp.com/dist/assets/UDAHeaders.js"></script>
    ```
2. Add the below script to the bottom of the page to load the SDK
    ```
    <script type="text/javascript">
        (function ()
         {
             var uda = document.createElement('script');
             uda.type = 'text/javascript';
             uda.src = 'https://udan-sdk.nistapp.com/dist/assets/UDALoad.js';
             uda.onload = () =>
             {
                 if (typeof UDAAuthDataConfig !== 'undefined')
                 {
                     UDAAuthDataConfig(
                     {
                         id: '123456789', // Pass the unique reference id of the user
                         email: 'dummy@dummy.com' // optional pass the email address of the user
                     });
                     // Additional parameters that can be passed.
                     UDAPluginSDK(
                     {
                         enableEditClickedName: false, // Flag for editing the clicked element
                         enableSkipDuringPlay: false, // Flag for enabling skip functionality
                         enableTooltipAddition: false, // Flag for adding custom tooltip information
                         enableNodeTypeSelection: false, // Flag for enabling node type selection
                         enableProfanity: false, // Flag for enabling profanity check
                         enableRecording: true, // Flag for enabling recording functionality
                         enableOverlay: true, // Flag for enabling overlay functionality or enabling squeeze functionality
                         enableUdaIcon: true, // Flag for enabling UdaIcon to appear on the screen
                         udaDivId: 'id of the document element', // Flag for attaching click event to open uda panel
                         enableForAllDomains: false, // Flag to enable all the recording to be visible across all domains
                         enableSpeechToText: false, // Flag to enable speech to text on the search bar.
                         enableSlowReplay: false // Flag to enable slow playback
                     });
                 }
             }
             document.body.appendChild(uda);
         })();
    </script>
    ```

## Installation instructions for developers

## Install dependencies

```bash
  npm install
```

## Build

To build chrome extension (to build folder)

```bash
  npm run build
```


## Installing to Chrome as Plugin

```
1. Under chrome -> Extensions (enable developer mode) 
2. Click on Load unpacked and select the build folder
3. Now open new tab and enter the url that you want to use for
