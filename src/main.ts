console.log("loaded....")
import './styles.css';
// Importing all images in the assets directory using require.context
const imagesContext = require.context('./assets', false, /\.(png|jpg|gif|svg)$/);

// imagesContext.keys().forEach((key) => {
//     const imgPath = imagesContext(key).default;
//     const imgElement = document.createElement('img');
//     imgElement.src = imgPath;
//     document.body.appendChild(imgElement);
// });
import { 
  initialize,
  IterableEmbeddedManager,
  IterableEmbeddedSessionManager,
  IterableEmbeddedCard,
  IterableEmbeddedBanner,
  IterableEmbeddedNotification 
} from '@iterable/web-sdk';

const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbmFuLm1laHRhK3Rlc3RAaXRlcmFibGUuY29tIiwiaWF0IjoxNzI0MzQyOTA1LCJleHAiOjE3NTQ1ODI5MDV9.BoAfB5t2syvl9YZSm7_-HGzgNDgzdEv9GfG0oE2Nzmo"; //exp = 08/29/2025
const apikey = "7df6f68cde704c16add48742964415dc";
const appPackageName = "itblembedded";
const email = window.location.search.split("email=")[1] || ''; // current email always set to manan.mehta+test@iterable.com

const embeddedManager = new IterableEmbeddedManager(appPackageName);
const embeddedSessionManager = new IterableEmbeddedSessionManager(appPackageName);
console.log("email=", email);

// Example placement ID, as assigned by Iterable.
const placementId = [152];

const { setEmail } = initialize(apikey, () => new Promise((resolve)=>{ resolve(jwtToken)}));

// syncMessages to fetch (from Iterable) embedded messages for the current user.
// setEmail(email)
//   .then(response => {
//     embeddedManager.syncMessages(
//       appPackageName,
//       () => {
//         // console.log('Fetched Embedded messages', JSON.stringify(embeddedManager.getMessages()));
//         // console.log('Fetched Embedded messages', embeddedManager.getMessages());
//         // Handle messages using embeddedMessageUpdateHandler
//         embeddedManager.addUpdateListener(handleFetchEmbeddedMessages);
        
//       },
//       placementId
//     );
//   })
//   .catch(error => {
//     console.log('Failed to set email:', error);
//   });

const htmlElements = {
  parent: {
    id: 'parent-id',
    styles: `
    background: white;
    border-color: purple;
    border-radius: 30px;
    padding: 10px;
    width: fit-content;
    overflow: hidden; /* Hide overflow */
  `
  },
  img: {
    id: 'img-id',
    styles: ''
  },
  title: {
    id: 'title-id',
    styles: `
      color: green;
    `
  },
  primaryButton: {
    id: 'primary-button-id',
    styles: `
      color: #8B0000;
      background: #FFFFFF;
    `
  },
  secondaryButton: {
    id: 'secondary-button-id',
    styles: '',
    disabledStyles: `
      opacity: .6;
      cursor: not-allowed;
      background: grey;
      color: grey;
    `
  },
  body: {
    id: 'body-id',
    styles: `
      color: green;
    `
  },
  buttonsDiv: {
    id: 'buttons-div-id',
    styles: ''
  }
};


setEmail(email)
  .then(response => {
    handleFetchEmbeddedMessages()
  })
  .catch(error =>{
    console.log('Failed to set email:', error)
  })


// Carousel logic
let currentIndex = 0;
let intervalId: NodeJS.Timeout | null = null;

const renderMessages = (messages:any) => {
  console.log(`In renderMessages function...`)
  const bannerContainer = document.getElementById('embedded-banner-container');
  
  if (bannerContainer) {
    bannerContainer.innerHTML = ''; // Clear existing banners

    messages.forEach((message:any) => {
      const card_title = message.elements?.title!;
      const card_body = message.elements?.body!;
      const card_mediaImage = message.elements?.mediaUrl!;

      console.log(`message title: ${message.elements?.title}`)
      console.log(`message body: ${message.elements?.body}`)
      console.log(`message image: ${message.elements?.mediaUrl}`)
      let banner: Object;
      banner = IterableEmbeddedBanner({
        appPackageName,
        message,
        htmlElements,
        errorCallback: (error) => console.log('Error: ', error)
      });

      // Wrap each message in a div with class "carousel-slide"
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      if (banner instanceof Node) {
        slide.appendChild(banner);
      } else if (typeof banner === 'string') {
        slide.innerHTML = banner;
      }

      // Add each slide to the container
      bannerContainer.appendChild(slide);
    });

    showSlide(currentIndex); // Initially show the first message

    // Start the carousel
    setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      showSlide(currentIndex);
    }, 5000); // Change slide every 5 seconds

  }
};

const showSlide = (index: number) => {
  const slides = document.getElementsByClassName('carousel-slide') as HTMLCollectionOf<HTMLElement>;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none'; // Hide all slides
  }

  // Show current slide and next slide for glimpse effect
  slides[index].style.display = 'block'; // Show the current slide
  if (slides[index + 1]) {
    slides[index + 1].style.display = 'block'; // Show the next slide for glimpse
    //slides[index + 1].style.opacity = '0.5'; // Slightly transparent
  }
  
};


const nextSlide = (msgLength:any) => {
  currentIndex = (currentIndex + 1) % msgLength; // Move to the next index
  showSlide(currentIndex);
};

const prevSlide = (msgLength:any) => {
  currentIndex = (currentIndex - 1 + msgLength) % msgLength; // Move to the previous index
  showSlide(currentIndex);
};

// handle embedded message here
const handleFetchEmbeddedMessages =  () => {
  try {
    const updateListener = {
      onMessagesUpdated: () => {
        // embeddedManager.getMessages()
        console.log('Fetched Embedded messages', JSON.stringify(embeddedManager.getMessages()));
        console.log('Fetched Embedded messages', embeddedManager.getMessages());
      
        // Define the container where all the banners will be injected
        //const bannerContainer = document.getElementById('embedded-banner-container');
        
        renderMessages(embeddedManager.getMessages());
        // Reference to carousel container
        //const carouselInner = document.getElementById('embedded-banner-container') as HTMLElement;
        /*embeddedManager.getMessages().forEach((message) => {
          const card_title = message.elements?.title!;
          const card_body = message.elements?.body!;
          const card_mediaImage = message.elements?.mediaUrl!;

          console.log(`message title: ${message.elements?.title}`)
          console.log(`message body: ${message.elements?.body}`)
          console.log(`message image: ${message.elements?.mediaUrl}`)

        });*/
      },
      onEmbeddedMessagingDisabled: () => {
        console.log("no message to display")
      }
    };
    
      embeddedManager.addUpdateListener(updateListener);
      embeddedManager.syncMessages(appPackageName, () => {
      // console.log('Getting embedded messages', JSON.stringify(embeddedManager.getMessages()));
      console.log("Message Synced....")
    });
  } catch (error) {
    console.log('error', error);
  }
};


// Handle errors
const errorCallback = (error: Error) => {
  console.error('Error displaying banner or tracking click event:', error);
};
  
// Manual Slideing
/*// Event listeners for next and previous buttons
const createNavigationButtons = () => {
  const bannerContainer = document.getElementById('bannerContainer');

  if (bannerContainer) {
    // Create Next Button
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.onclick = () => {
      nextSlide();
      resetInterval();
    };
    bannerContainer.appendChild(nextButton);

    // Create Previous Button
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.onclick = () => {
      prevSlide();
      resetInterval();
    };
    bannerContainer.appendChild(prevButton);
  }
};

// Reset interval after manual navigation
const resetInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      nextSlide();
    }, 7000);
  }
}; */

      
// This sample code assumes that embeddedManager has already been instantiated
      // (for an example, see step 4, above), and that embeddedMessageImage, 
      // embeddedMessageTitle, embeddedMessageBody, embeddedMessageButton1, 
      // embeddedMessageButton2, and embeddedMessage are already set up to reference 
      // elements of an embedded message UI.
/** template code from support doc 
      const embeddedMessageUpdateHandler = {
        onMessagesUpdated: () => {
      
          // a single placement, that has ID 327. 
          const placementId = 327;
      
          // Grab the messages that the SDK has already fetched and now has in memory.
          const messages = embeddedManager.getMessagesForPlacement(placementId)
      
          // If there are any messages to display...
          if (messages.length > 0) {
      
            // Display the first message.
            const message = messages[0];
      
            // Here, you could display the embedded messaging using an out-of-the-box
            // view, or using a custom message display. This examples uses a custom
            // message view. For information about out-of-the-box views, see 
            // Out of the Box Views, at the bottom of this article.
      
            // Set up the message
            embeddedMessageImage.src = message.elements?.mediaUrl;
            embeddedMessageTitle.innerText = message.elements?.title;
            embeddedMessageBody.innerText = message.elements?.body;
      
            // Set up the first button
            if (message.elements?.buttons?.length > 0) {
              let button = message.elements?.buttons[0];
              embeddedMessageButton1.innerText = button.title;
              // For "Open URL" buttons, the URL is in the data field. Otherwise,
              // the URL is in the type field.
              embeddedMessageButton1.href = button.action?.type === 
                 "openUrl" ? button.action?.data : button.action?.type;
              embeddedMessageButton1.style.display = "inline";
            }
      
            // Set up the second button
            if (message.elements?.buttons?.length > 1) {
              let button = message.elements?.buttons[1];
              embeddedMessageButton2.innerText = button.title;
              embeddedMessageButton2.href = button.action?.type === 
                 "openUrl" ? button.action?.data : button.action?.type;
              embeddedMessageButton2.style.display = "inline";
            }
      
            // Display the message (this example assumes that the embedded message
            // UI was hidden, and should now be displayed).
            embeddedMessage.style.display = "block";
      
            // Start a session & impression. 
            embeddedSessionManager.startSession();
            embeddedSessionManager.startImpression(message.metadata.messageId, placementId);
          }
      
        },
        onEmbeddedMessagingDisabled: () => {
          // There was an error, so hide the embedded message display
          embeddedMessage.style.display = "none";
        }
      };
      */

