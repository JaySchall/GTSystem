import { Component } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import BLM from '../img/carousel/BLM_carousel.png';
import Seed from '../img/carousel/Seed_Sampler_Carousel.png';
import Tiny from '../img/carousel/TinyExpo_Carousel.png';
import Wapur from '../img/carousel/WAPUR2023_Carousel.jpg';

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
        <a href="https://aadl.org/blacklivesmatter">
        <img src={BLM} alt="BLM" />
        </a>

        <a href="https://aadl.org/node/621838">
        <img src={Seed} alt="Seed" />
        </a>
        <a href="https://aadl.org/seedsampler">
        <img src={Tiny} alt="Tiny" />
        </a>
        <a href="https://aadl.org/tinyexpo">
        <img src={Wapur} alt="Wapur" />
        </a>
      </Slider>
    );
  };
}