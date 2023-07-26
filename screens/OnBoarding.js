// https://www.google.com/search?q=react+native+onboarding&ei=B82_ZLSwF7CWhbIP_NunqAk&oq=react+native+on&gs_lp=Egxnd3Mtd2l6LXNlcnAiD3JlYWN0IG5hdGl2ZSBvbioCCAAyCBAAGIoFGJECMgUQABiABDIIEAAYigUYkQIyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESIgTUPUEWK4GcAF4AZABAJgBogKgAa8EqgEDMi0yuAEDyAEA-AEBwgIKEAAYRxjWBBiwA-IDBBgAIEGIBgGQBgg&sclient=gws-wiz-serp

import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// https://www.npmjs.com/package/react-native-onboarding-swiper

// https://blog.openreplay.com/setting-up-onboarding-screens-in-react-native/

// https://blog.logrocket.com/how-to-create-onboarding-screens-with-react-native-viewpager/ 
// Die een!

const OnBoarding = (props) => {
  
    return (
        <Onboarding
        //To handle the navigation to the Homepage if Skip is clicked
        onSkip={() => navigation.replace("Home")}

        //To handle the navigation to the Homepage after Done is clicked
        onDone={() => navigation.replace("Home")}
        pages={[
    {
        backgroundColor: '#a6e4d0',
        image: <Image source={require('../assets/list.png')} />,
        title: 'Welcome',
        subtitle: 'Welcome to the first slide of the Onboarding Swiper.',
    },
    {
        backgroundColor: '#fdeb93',
        image: <Image source={require('../assets/list.png')} />,
        title: 'Explore',
        subtitle: 'This is the second slide of the Onboarding Swiper.',
    },
    {
        backgroundColor: '#e9bcbe',
        image: <Image source={require('../assets/list.png')} />,
        title: 'All Done',
        subtitle: 'This is the Third slide of the Onboarding Swiper.',
    },
        ]}
    />
    );
  };
  
  export default OnBoarding;