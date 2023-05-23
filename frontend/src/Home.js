import Sidenav from "./Sidenav";
import Map from "./Map";
import Copyright from "./Copyright";

const Home = () => {
    return (
        <div><Map></Map>
          <Sidenav></Sidenav>
          <Copyright></Copyright>
        </div>
      );
};

export default Home;
