import Sidenav from "./Sidenav";
import Map from "./Map";
import Admin from "./Admin";

const Home = () => {
    return (
        <div><Map></Map>
          <Sidenav></Sidenav>
          <Admin></Admin>
        </div>
      );
};

export default Home;
