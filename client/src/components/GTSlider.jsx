import { Component } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import SAHS from '../img/carousel/AADL_GT-Round 3_Carousel.png';
import Seed from '../img/carousel/Seed_Sampler_Carousel.png';
import Pokemon from '../img/carousel/220616-A2SF_PokemonGaming_Carousel.jpg';
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
        <a href="https://aadl.org/node/574083">
        <img src={SAHS} alt="Stay-at-Home-Smash-3" />
        </a>

        <a href="https://aadl.org/node/600070">
        <img src={Pokemon} alt="PokemonTop" />
        </a>
        <a href="https://aadl.org/seedsampler">
        <img src={Seed} alt="Seed" />
        </a>
        <a href="https://aadl.org/node/621838">
        <img src={Wapur} alt="Wapur" />
        </a>
      </Slider>
    );
  };
}