# Digital_Assistant_Client

Client for Universal Digital Assistant

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

# Steps for installation

### Chrome Plugin

```
1. Download the git repo into local folder or install it from chrome store(coming soon..)
2. Under chrome -> Extensions (enable developer mode) 
3. Click on Load unpacked and select the chrome-plugin folder
4. Ensure that profile sync is on in order to access the user information.
```

### Integrate as sdk into applications

1. Add the below Script in head as first script tag
    ```
    <script src="https://kcramakrishna.github.io/Digital_Assistant_Client/chrome-plugin/js/links.js"></script>
    ```
2. Add the below script to the bottom of the page to load the SDK
    ```
    <script type="text/javascript">
        (function(){
            // unique reference for identifying the user these can be declared post login also.
            udaauthdata.id='123456789';
            // user emailid or name can be passed.
            udaauthdata.email='dummy@dummy.com';
            var uda = document.createElement('script'); uda.type = 'text/javascript'; uda.src = 'https://kcramakrishna.github.io/Digital_Assistant_Client/lib/include.js';
            document.body.appendChild(uda);
        })();
    </script>
    ```
3. For disabling the recording sequence functionality for unwanted users you can just make the below attribute true post
   loading of the scripts
    ```
    udaauthdata.restrict_add_delete=true;
    ```
4. For adding custom colors you can create your own theme from below base theme url and you can put the css file in your
   server and can pass it to the plugin as given below

   ### Base Theme URL
    ```
    https://kcramakrishna.github.io/Digital_Assistant_Client/chrome-plugin/themes/base.css 
    ```

   ### Variable
   ```
   UDACustomCss.url = "path/to/your/css/file";
   ```
   
   Example:
    ```
    UDACustomCss.url = "https://kcramakrishna.github.io/Digital_Assistant_Client/chrome-plugin/themes/base.css";
    ```

