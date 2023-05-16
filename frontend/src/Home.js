import Sidenav from "./Sidenav";
import Map from "./Map";
import Admin from "./Admin";

const Home = () => {
    return (
        <div><Map></Map>
        <Admin></Admin>
          <Sidenav></Sidenav>
        </div>
      );


};

export default Home;
