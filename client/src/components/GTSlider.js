import { Component } from "react";
import Slider from "react-slick";
import { SliderHelper } from '../utils/Slide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const PrevArrow = ({ currentSlide, slideCount, ...props }) => (
  <div {...props}
    className={
      "slick-prev slick-arrow" +
      (currentSlide === 0 ? " slick-disabled" : "")
    }
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button">
    <FontAwesomeIcon icon={ faAngleLeft } className="fa" />
  </div>
);

const NextArrow = ({ currentSlide, slideCount, ...props }) => (
  <div 
    {...props}
    className={
      "slick-next slick-arrow" +
      (currentSlide === slideCount - 1 ? " slick-disabled" : "")
    }
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
    type="button">
    <FontAwesomeIcon icon={ faAngleRight } className="fa" />
  </div>
);

export default class GTSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speeed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
    };

    return (
      <Slider className="image-slider" {...settings} >
        <h1>1</h1>
        <h1>2</h1>
        <h1>3</h1>
        <h1>4</h1>
      </Slider>
    );
  };
}