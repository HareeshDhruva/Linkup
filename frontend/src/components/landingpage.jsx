import { footerData } from "../../data"
import Alternatives from "./alternatives"
import Feature from "./feature"
import Footer from "./Footer"
import Hero from "./hero"

const Landingpage = () => {
  
  return (
    <div>
      <Hero/>
      <Feature/>
      <Alternatives/>
      <Footer heading={"linkup"} footerData={footerData} />
    </div>
  )
}

export default Landingpage
