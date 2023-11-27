import { Component } from "react";
import Slider from "react-slick";
import { SliderHelper } from '../utils/Slide';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

//import "../css/slide.css"

export default class GTSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speeed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <Slider {...settings} >
        <h1>1</h1>
        <h1>2</h1>
        <h1>3</h1>
        <h1>4</h1>
      </Slider>
    );
  };
}