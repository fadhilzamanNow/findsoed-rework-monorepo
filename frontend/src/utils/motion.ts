import { Variant } from "motion-v";

export const fadeIn = (direction : string, delay : number) : {[k : string] : Variant }  => {
    return {
      hidden: {
        y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
        x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
        opacity: 1
      },
      show: {
        y: 0,
        x: 0,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 1.25,
          delay: delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        }
      }
    };
  };
  
  
  export const textFromLeft = (delay : number) : { [k : string ] : Variant} => {
    return {
      hidden: {
        x: -15,
        opacity: 1,
      },
      show: {
        x: 0,
        opacity: 100,
        transition: {
          type: "spring",
          duration: 1.25,
          delay
        }
      },   
    };
  };

  export const textFromRight = (delay : number) : { [k : string]: Variant } => {
    return {
      hidden: {
        x: 30,
        opacity: 1,
      },
      show: {
        x: 0,
        opacity: 100,
        transition: {
          type: "spring",
          duration: 1.25,
          delay,
        }
      },
      
    };
  };

