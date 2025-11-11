import React from "react";
import HeroSection from "../components/hero/HeroSection.jsx";


const HistoryView = () => {
  return (
    <div>
      <div className="home-hero">
        <div className="homeHero-bg1 fadeIn">
          <div className="homeHero-bg2"></div>
        </div>
        <HeroSection />
      </div>

      <fieldset style={{ margin: "20px", padding: "20px", borderRadius: "10px", border: "0px solid #ccc", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  width: "800px", height:"auto", marginLeft: "auto", marginRight: "auto", textAlign: "center",  backgroundColor: "rgba(247, 253, 255, 0.5)" }}>
        <legend><span style={{fontSize:'48px', fontWeight:"bold"}}>History</span></legend>
        <div>
          <h2 style={{fontSize: "30px", fontWeight: "bold"}}>For Over 50 Years... We Have Received Grace Upon Grace</h2>
          <br />
          <h4 style={{textAlign: "justify", textDecoration: "none", fontSize: "20px" }}>
            In 1943, Immanuel Lutheran Church of Copperas Cove, Texas, initiated
            the idea of a mission church in Killeen. Services began May 23, 1954,
            under the sponsorship of Immanuel. Worship and Sunday School were held
            at the Center Theater at 409 North Gray Street in downtown Killeen. On
            Sunday, April 3, 1955, Grace Lutheran Church was formally organized as
            a mission congregation of the Texas District, Lutheran Church –
            Missouri Synod. On July 13, 1958, the congregation moved temporarily
            from the Center Theater to Fowler Elementary School on Trimmier Road.
            The first church building was built and dedicated at 1301 South
            Trimmier Road on September 14, 1958. Over the years, the Holy Spirit
            blessed the Grace Family with steady growth. In 1970, the congregation
            changed from mission status to being a self-supporting congregation.
            On September 13, 1970, the congregation dedicated the current
            facilities at 1007 Bacon Ranch Road. On April 2, 1995, the
            congregation celebrated its 40th Anniversary. Part of this celebration
            included the dedication of the expanded and remodeled facilities. This
            building project began in 1993 as Phase I of a three phase
            construction plan and included a new Education Wing, a new Narthex, a
            renovated Sanctuary, and the remodeling of the administration
            facilities. Grace celebrated its 50th Anniversary in 2005 with a three
            part celebration under the theme, “Remember, Rejoice, Rededicate.”
            Grace Lutheran School began as a preschool ministry in 1978 with
            kindergarten being added in 1983 and 1st grade in 1984. Over the years
            various grades were added as enrollment increased. In the fall of
            1997, two portable educational buildings were added to meet the needs
            of the expanding needs of the school and church. The school has faced
            many challenges and has enjoyed 25 years of blessings and success
            serving the congregation and the Killeen and Ft. Hood communities.
          </h4>
        </div>
      </fieldset>

      
    </div>
  );
};

export default HistoryView;
