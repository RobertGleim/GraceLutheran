import React from "react";
import HeroSection from "../components/hero/HeroSection.jsx";
import "./WorshipView.css";


const WorshipView = () => {
  return (
    <>
  <HeroSection className="worshipview-hero" />
  <div className="worshipview-content">
    <h1>Worship Schedule</h1>
    <h3>Sunday School & Bible Study at 8:30 am</h3>
    <h3>Divine Service at 10:00 am</h3>
  </div>
  <div className="worshipview-about">
    <h1>About Worship at Grace</h1>
    <br /><br />
    <h4>
      Grace Lutheran Church is a liturgical church.  However, this does not mean that Grace is old-fashioned and archaic as many understand “liturgical” to be.  To say that a church is liturgical is to say that it follows God’s active work to bring His people into His presence to feed them with His Word and Sacraments and renew them through the forgiveness of sin through Jesus’ death and resurrection.
      <br /><br />
      Grace Lutheran Church is also a contemporary church.  However, this does not mean that Grace seeks to be sensational for the sake of entertainment as some understand “contemporary” to be.  To say that a Church is contemporary (a word that literally means, “for the current time”) is to say that the Word of God is taught in its purity to address the issues of today’s world and culture and provide God’s people with the necessary instruction to remain faithful to God.
      <br /><br />
      This is the goal of the worship services (or, more properly termed, the Divine Liturgy) here at Grace – to stay focused on what God is actively doing in our midst so that we might rightly apply His Word and grace to live faithfully in this world.  We use the liturgically ordered services and hymns provided in the Lutheran Service Book.  But, we also use some thematically composed confessions and litanies as well as some contemporary music selections.  If you are considering visiting Grace, we pray that you will be enlightened by the gifts of the Holy Spirit through the Word of the Gospel and administration of the Sacraments.
    </h4>
  </div>
  <div className="worshipview-special">
    <h1>Special Services</h1>
    <br /><br />
    <h3>
      During Advent (the period between Thanksgiving and Christmas) and Lent (the period between Ash Wednesday and Easter), Grace offers additional worship opportunities on Wednesday evenings.  These services are usually governed by a uniting theme, focusing on a specific aspect of the respective seasons.  They also include the celebration of Holy Communion.  The services begin at 7:15 pm and are preceded by a light supper sponsored by one the Board of Grace.  Visitors are welcome to join us for both the services and the meals.
      <br /><br />
      Other special services are observed for Thanksgiving, Christmas Eve and Day and New Year’s Eve.  Please consult the church calendar for the scheduled times.
    </h3>
  </div>
  <div className="worshipview-communion">
    <h1>Holy Communion</h1>
    <br /><br />
    <h4>
      Here at Grace, we celebrate the Lord’s Supper at almost every service through the Church Year.  The two exceptions to this practice are Good Friday and the Christmas Eve Carols & Readings service.  Because there are differing understandings and confessions about the Lord’s Supper, we do follow the Biblical practice of Close(d) Communion.  This stems not only from our desire to preserve the unity of the confession of those who commune together at Grace but, and perhaps more importantly, to protect the spiritual well-being of those who commune – especially those of a different confession than that of the Lutheran Church – Missouri Synod.  If you are planning on visiting with us and desire to commune, you are asked to review our Statement of Doctrine and Practice and to speak with the Pastor about receiving the Lord’s Supper.
    </h4>
    <br />
    <a className="about-holy"
      href="/About-Holy-Communion.pdf"
      target="_blank"
    >
      Statement of Doctrine & Practice
    </a>

    

</div>

</>

  );
};

export default WorshipView;
