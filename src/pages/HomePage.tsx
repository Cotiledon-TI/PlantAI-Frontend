import '../styles/index.css'
import Banner from '../components/Banner'
import GoogleMapEmbed from '../components/GoogleMaps';
import InfoCards from '../components/InfoCards';
import FeaturedProducts from '../components/FeaturedProducts';

export default function HomePage() {
  return (
    <div className='container'>
      <Banner />
      <FeaturedProducts />
      <InfoCards />
      <GoogleMapEmbed />
    </div>
  );
}
