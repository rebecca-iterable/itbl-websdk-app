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

const jwtToken = ""; //exp = 08/29/2025
const apikey = "";
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
  // Styles to apply to the HTML element that contains the out-of-the-box view.
  // Not the element whose innerText you set to the out-of-the-box view, but
  // its first child.
  parent: {
    // id to assign
    id: 'parent-id',
    // Styles must be strings
    styles: `
      background: white;
      border-color: purple;
      border-radius: 30px;
      padding: 10px;
      width: fit-content;
    `
  },
  // Image styles
  img: {
    id: 'img-id',
    styles: ''
  },
  // Title text styles
  title: {
    id: 'title-id',
    styles: `
      color: green;
    `
  },
  // Primary button styles
  primaryButton: {
    id: 'primary-button-id',
    styles: `
      color: #8B0000;
      background: #FFFFFF;
    `
  },
  // Secondary button styles
  secondaryButton: {
    id: 'secondary-button-id',
    styles: '',
    // If you give disabledStyles to a button, the button will be disabled. To
    // enable the button, re-render the HTML component without the disabledStyles.
    disabledStyles: `
        opacity: .6;
        cursor: not-allowed;
        background: grey;
        color: grey;
      `
  },
  // Body text styles
  body: {
    id: 'body-id',
    styles: `
      color: green;
    `
  },
  // Div containing the buttons
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

// create carousel
const createHtmlElements = (cardTitle:any, cardBody:any, cardMedia:any) =>{
  const slide = document.createElement('div');
  slide.classList.add('carousel-slide');
  
  const title = document.createElement('h2');
  title.innerHTML = cardTitle;
  
  const content = document.createElement('p');
  content.innerHTML = cardBody;
  
  const mediaImg = document.createElement('a');
  mediaImg.innerHTML = cardMedia;
  
  slide.appendChild(title);
  slide.appendChild(content);
  slide.appendChild(mediaImg);
  
  console.log("slide.....")
  console.log(`typeof slide ${typeof slide}`);
  console.log(slide)

  return slide;
}

// Carousel logic
let currentIndex = 0;

const renderMessages = (messages:any) => {
  const bannerContainer = document.getElementById('bannerContainer');

  if (bannerContainer) {
    bannerContainer.innerHTML = ''; // Clear existing banners

    messages.forEach((message, index) => {
      const banner = IterableEmbeddedBanner({
        packageName: `my-website-message-${index}`,
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

  slides[index].style.display = 'block'; // Show the current slide
};

// handle embedded message here
const handleFetchEmbeddedMessages =  () => {
  try {
    const updateListener = {
      onMessagesUpdated: () => {
        // embeddedManager.getMessages()
        console.log('Fetched Embedded messages', JSON.stringify(embeddedManager.getMessages()));
        console.log('Fetched Embedded messages', embeddedManager.getMessages());
        let msgCount = embeddedManager.getMessages().length;
        // Define the container where all the banners will be injected
        const bannerContainer = document.getElementById('embedded-banner-container');
        
        // Reference to carousel container
        //const carouselInner = document.getElementById('embedded-banner-container') as HTMLElement;
        embeddedManager.getMessages().forEach((message) => {
          const card_title = message.elements?.title!;
          const card_body = message.elements?.body!;
          const card_mediaImage = message.elements?.mediaUrl!;

          console.log(`message title: ${message.elements?.title}`)
          console.log(`message body: ${message.elements?.body}`)
          console.log(`message image: ${message.elements?.mediaUrl}`)

          // Create a banner for each message
          const card = IterableEmbeddedBanner({
            appPackageName,
            message,
            htmlElements,
            errorCallback
          }); 

          if(bannerContainer){
            bannerContainer.innerHTML = ''; // Clear existing banners
            // Wrap each message in a div with class "carousel-slide"
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.innerHTML = card;
            // bannerContainer.innerHTML += card;
            // Add each slide to the container
            bannerContainer.appendChild(slide);
            showSlide(currentIndex); // Initially show the first message

            // Start the carousel
            setInterval(() => {
              currentIndex = (currentIndex + 1) % msgCount;
              showSlide(currentIndex);
            }, 5000); // Change slide every 5 seconds
          }else {
            console.error("Banner container not found in the DOM.");
          }

        });
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

const showSlide = (index: number) => {
  const slides = document.getElementsByClassName('carousel-slide') as HTMLCollectionOf<HTMLElement>;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none'; // Hide all slides
  }

  slides[index].style.display = 'block'; // Show the current slide
};


// Handle errors
const errorCallback = (error: Error) => {
  console.error('Error displaying banner or tracking click event:', error);
};
  
// script.ts
document.addEventListener('DOMContentLoaded', () => {
console.log('Fitness website loaded.');

// Carousel functionality
const carouselWrapper = document.querySelector('.carousel-wrapper') as HTMLElement;
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-button.prev') as HTMLButtonElement;
const nextButton = document.querySelector('.carousel-button.next') as HTMLButtonElement;

let currentIndex = 0;

const updateCarousel = () => {
const offset = -currentIndex * 100;
carouselWrapper.style.transform = `translateX(${offset}%)`;
};

// prevButton.addEventListener('click', () => {
//     currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
//     updateCarousel();
// });

// nextButton.addEventListener('click', () => {
  //     currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
  //     updateCarousel();
  // });
  
  // Initialize carousel
  updateCarousel();
});
      
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

