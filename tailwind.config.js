const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    content: ['theme/**/*.liquid'],
    layers: ['utilities']
  },
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          '100': '#F9F9F9',
          '200': '#FBFBFB',
          '300': '#BCBCBC',
          '400': '#FFFDFE',
          '500': '#EEEEEE',
          '600': '#B0B0B0',
          '700': '#A8A9AD',
          '800': '#998a8a' ,
          '900': '#FDF9FE',
          '1000': '#C8C6C8',
          '1100': '#E0DCE0'          
        },       
        blackesh: {
          ...colors.blackesh,
          '100': '#4B3B4C',
          '200': '#847486',
          '300': '#3A3137',
          '400': '#343233',
          '500': '#E9E9E9',
          '600': '#6E646F',
          '700': '#E8E8E8' 
          
        },
        puce: {
          ...colors.puce,
          '100': '#CA8685',
          '200': '#FDF9FE',
          '300': '#FFF3EE',         
          '400': '#867887',
          '500': '#FED0BA', 
          '600': '#453847',
          '700': '#FFEEE7',
          '800': '#FFF4F0'              
          
        },        
        bordercolor: {
          ...colors.bordercolor,
          '100': '#E4C5CF',
          '200': '#6A606C'          
        }
        
      },
      fontSize: {
        font8: ['8px' , '10px'],
        font10: ['10px' , '14px'],
        font11: ['11px' , '14px'],
        font12: ['12px' , '16px'],
        font13: ['13px' , '17px'],
        font14: ['14px' , '19px'],
        font15: ['15px' , '20px'],
        font16: ['16px' , '24px'], 
        font16new: ['16px' , '23px'], 
        font17: ['17px' , '26px'], 
        font18: ['18px' , '26px'], 
        font18p: ['18px' , '22px'], 
        font19: ['19px' , '25px'], 
        font20: ['20px' , '30px'], 
        font21: ['21px' , '31px'], 
        font22: ['22px' , '32px'],
        font23: ['23px' , '32px'], 
        font24: ['24px' , '34px'], 
        font25: ['25px' , '30px'],
        font25new: ['25px' , '35px'],
        font26: ['26px' , '31px'],
        font27: ['27px' , '32px'],
        font28: ['28px' , '32px'],
        font29: ['29px' , '34px'],
        font30: ['30px' , '36px'],
        font32: ['32px' , '40px'],
        font33: ['33px' , '38px'],  
        font34: ['34px' , '44px'],
        font35: ['35px' , '40px'],
        font36: ['36px' , '41px'],
        font37: ['37px' , '42px'],
        font38: ['38px' , '45px'],
        font39: ['39px' , '46px'],
        font40: ['40px' , '50px'],
        font40new: ['40px' , '60px'],
        font45: ['45px' , '50px'],
        font46: ['46px' , '57px'],
        font50: ['50px' , '57px'],
        font55: ['55px' , '65px'],
        font60: ['60px' , '70px'],
        font65: ['65px' , '75px'],
        font75: ['75px' , '85px'],
        font70: ['70px' , '80px'],
        font80: ['80px' , '90px'],
        font85: ['85px' , '95px'],
      },
      
      screens: {
        '1440Width': '1440px',
        '2xl': '1536px',
        'lpscreen': '1650px',
        '4xl': '1750px',
        'midxl': '1850px',
        '5xl': '1920px',
        '21xl': '2100px',
      },
      padding: {
        p15: '15px',
        p50: '50px',
        p25: '25px',
        p30: '30px',
        p52: '52px',
        p58: '58px',
        p60: '60px',
        p70: '70px',
        p65: '65px',
        p68:'68px',
        p85:'85px',
        p90:'90px',
        p120: '90px',
        p117: '100px',
        p137: '137px',
      },
      margin: {
        m15: '15px',
        m50: '50px',
        m25: '25px',
        m30: '30px',
        m65: '65px',
        m70: '70px',
        m120: '90px',
        m117: '100px',
      },
      width: {
        '1' : '1px',
        '6' : '6px',
        '10' : '10px',
        'w14' : '14px',
        'w17' : '17px',
        '20' : '20px',
        'w24' : '24px',
        '35' : '35%',
        '55' : '55%',
        '55px' : '55px',
        '37' : '37px',
        '43' : '43px',
        '45' : '45%',
        '46' : '46px',
        '47' : '47px',
        '67' : '67px',
        '79' : '79px',
        '100' : '100px',
        '115' : '115px',
        '163' : '163px',
        
      },
      height: {
        '6' : '6px',
        '17' : '17px',
        '20' : '20px',
        '22' : '22px',
        '37' : '37px',
        '43' : '43px',
        'h24' : '24px',
        '46' : '46px',
        '47' : '47px',
        '52' : '52px',
        '53' : '53px',
        '55' : '55px',
        '73' : '73px',
        '60' : '60px',
        '65' : '65px',
        '79' : '79px',
        '100' : '100px',
        '115' : '115px',
        '163' : '163px',
      },
      boxShadow: {
        'shadow-header': '0px 9px 64px rgba(75, 59, 76, 0.5);',
        'shadow-dropdown': '0px 4px 4px rgba(0, 0, 0, 0.1)',
        'logo-shadow': '0px 4px 15px rgba(0, 0, 0, 0.23)',
        'card-shadow': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'qty-shadow': '0px 4px 12px rgba(137, 187, 43, 0.1)',
        'img-shadow': '0px 4px 12px rgb(0 64 82 / 15%)',
        'green-shadow': '0px 3px 12px -1px rgba(137, 187, 43, 0.24)',
      },
      border:{
        'b1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      borderRadius: {
        '10': '10px',
        '15': '15px',
        '20': '20px',
        '25': '25px',
        '30': '30px',
        '35': '35px',
        '40': '40px',
        '50': '50px',
        '60': '60px',
      },
      letterSpacing: {
        
        '2': '0.2em',
        '4': '0.04em',
        '5': '0.05em',
        '6': '0.06em',
        '7': '0.06em',
        '8': '0.08em',
        '9': '0.09em',
        '12': '0.12em',
      },

    },
    fontFamily: {
      
      inter: ['Inter', 'sans-serif'],
      dmserif: ['DM Serif Display', 'sans-serif'],
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    container: false
  }
}





