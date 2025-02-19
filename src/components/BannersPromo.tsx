import '../styles/BannersPromo.css'

interface BannerProps {
  image: string;
  discount: string;
  label: string;
  title: string;
}

const Banner: React.FC<BannerProps> = ({ image, discount, label, title }) => {
  return (
    <div className="banner">
      <img src={image} alt={title} />
      <div className="banner-content-promo">
      <div className="label">{label}</div>
        <div className="discount">{discount}</div>
        {title.split(' DE ').map((part, index) => (
          <div key={index} className="title-line">
            {index === 0 ? `${part} DE` : part}
          </div>
        ))}
      </div>
    </div>
  );
};

const BannerContainer: React.FC = () => {
  const banners = [
    {
      label: "Desde",
      discount: "40% Dcto",
      title: "PLANTAS DE INTERIOR",
      image: "/src/assets/banner-promo01.png",

    },
    {
      label: "Desde",
      discount: "40% Dcto",
      title: "PLANTAS DE INTERIOR",
      image: "/src/assets/banner-promo02.png",
    },
    {
      label: "Desde",
      discount: "40% Dcto",
      title: "PLANTAS DE INTERIOR",
      image: "/src/assets/banner-promo03.jpeg",
    }
  ];

  return (
    <div className="banner-container">
      {banners.map((banner, index) => (
        <Banner key={index} {...banner} />
      ))}
    </div>
  );
};

export default BannerContainer;