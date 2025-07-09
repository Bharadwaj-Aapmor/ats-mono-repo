import React from "react";
import Slider from "react-slick";
import "../styles/landingpage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pic1 from "../assets/pic1.svg";
import pic2 from "../assets/pic2.svg";
import pic3 from "../assets/pic3.svg";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,

    appendDots: (dots) => (
      <div>
        <ul
          style={{
            margin: "0px",
            padding: "0px",
          }}
        >
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="full-width-carousel">
        <Slider {...settings}>
          <div className="full-width-slide">
            <img src={pic1} alt="Slide 1" className="slide-image" />
          </div>
          <div className="full-width-slide">
            <img src={pic2} alt="Slide 2" className="slide-image" />
          </div>
          <div className="full-width-slide">
            <img src={pic3} alt="Slide 3" className="slide-image" />
          </div>
        </Slider>
      </div>
    </>
  );
};

export default Carousel;
