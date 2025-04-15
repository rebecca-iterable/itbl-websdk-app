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

const jwtToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzYxOTE1MjUsImlhdCI6MTc0NDY1NTUyNSwiZW1haWwiOiJyZWJlY2NhK2NvbGxlY3RpdmV2b2ljZUBpdGVyYWJsZS5jb20ifQ.ghR6PF6R_BPO6rUhDM20EgTZDIFDL3q1Bg8xoVdrHV4"; 

//exp = 04/14/2025
const apikey = "fcbf364742dd43f9be89f639dfaf5713";

const appPackageName = "com.rebecca.webinapptest";

// current email always set to manan.mehta+test@iterable.com
const email = window.location.search.split("email=")[1] || ''; 

const embeddedManager = new IterableEmbeddedManager(appPackageName);
const embeddedSessionManager = new IterableEmbeddedSessionManager(appPackageName);
console.log("email=", email);

// Example placement ID, as assigned by Iterable.
const placementId = 1455;

const { setEmail } = initialize(apikey, () => new Promise((resolve)=>{ resolve(jwtToken)}));

// Control OOTB Card Styles from htmlElements
const htmlElements = {
  parent: {
    id: 'parent-id',
    styles: `
    background: #f4f4f4;
    border-color: purple;
    border-width: 2px;
    border-radius: 30px;
    padding: 10px;
    width: fit-content;
    overflow: hidden; /* Hide overflow */
  `
  },
  img: {
    id: 'img-id',
    styles: `
    width: 25%;
    height: 25%;
    `
  },
  title: {
    id: 'title-id',
    styles: `
      color: #000000;
    `
  },
  primaryButton: {
    id: 'primary-button-id',
    styles: `
      color: #ffffff;
      background: #000000;
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
      color: #000000;
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
