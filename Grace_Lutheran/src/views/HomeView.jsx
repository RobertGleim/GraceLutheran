import React, { useEffect, useState } from 'react';
import './HomeView.css';
import SearchBible from '../components/SearchBible.jsx';
import { API_KEY } from '../../my_key.jsx';


// API_KEY is now imported from my_key.jsx
const BIBLE_ID = '06125adad2d5898a-01'; // The Holy Bible, American Standard Version
const VERSES = [
  // Old Testament
  'GEN.1.1', // Genesis 1:1
  'EXO.20.15', // Exodus 20:15
  'PRO.3.5-6', // Proverbs 3:5-6
  'PRO.22.6', // Proverbs 22:6
  'ISA.40.31', // Isaiah 40:31
  'ISA.41.10', // Isaiah 41:10
  'JER.29.11', // Jeremiah 29:11
  'JOS.1.9', // Joshua 1:9
  'PSA.23.1', // Psalm 23:1
  'PSA.46.1', // Psalm 46:1
  'PSA.121.8', // Psalm 121:8
  'MIC.6.8', // Micah 6:8
  // New Testament
  'MAT.6.33', // Matthew 6:33
  'MAT.7.12', // Matthew 7:12
  'MAT.11.28', // Matthew 11:28
  'JHN.3.16', // John 3:16
  'JHN.14.6', // John 14:6
  'ROM.8.28', // Romans 8:28
  'ROM.10.9', // Romans 10:9
  'ROM.12.2', // Romans 12:2
  '1COR.10.13', // 1 Corinthians 10:13
  '1COR.13.4-8', // 1 Corinthians 13:4-8
  'GAL.5.22-23', // Galatians 5:22-23
  'EPH.2.8-9', // Ephesians 2:8-9
  'PHP.4.6-7', // Philippians 4:6-7
  'PHP.4.13', // Philippians 4:13
  'HEB.11.1', // Hebrews 11:1
  'JAS.1.5', // James 1:5
  'JAS.5.16', // James 5:16
  '1PET.5.7', // 1 Peter 5:7
  'REV.21.4', // Revelation 21:4
];

const HomeView = () => {
  const [verseText, setVerseText] = useState('Loading...');
  const [verseRef, setVerseRef] = useState('');

  useEffect(() => {
    // Pick a random Bible version and verse each time the page is loaded
  const verseIndex = Math.floor(Math.random() * VERSES.length);
  const verseID = VERSES[verseIndex];

    async function fetchVerse() {
      try {
        const res = await fetch(`https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/search?query=${verseID}`, {
          headers: {
            'api-key': API_KEY,
          },
        });
        const data = await res.json();
        if (data && data.data && data.data.passages && data.data.passages.length > 0) {
          const passage = data.data.passages[0];
            // Remove <span class="v">...</span> and <span ... data-number ...>...</span> from passage.content
            let cleanedContent = passage.content.replace(/<span class="v">.*?<\/span>/g, '');
            cleanedContent = cleanedContent.replace(/<span[^>]*data-number[^>]*>.*?<\/span>/g, '');
            setVerseText(`<div class='text eb-container'>${cleanedContent}</div>`);
            setVerseText(`<div class='text eb-container'>${cleanedContent}</div>`);
            setVerseRef(passage.reference);
        } else {
          setVerseText('Verse not found.');
        }
      } catch {
        setVerseText('Error fetching verse.');
      }
    }
    fetchVerse();
  }, []);

  return (
    <>
      <div className="home-view">
        <h1>Welcome to Grace Lutheran Church</h1>
        <p>Your faith journey begins here.</p>
      </div>
      <div className="daily-verse">
        <h2>Daily verse</h2>
        <h3>{verseRef}</h3>
        <div dangerouslySetInnerHTML={{ __html: verseText }} />
        <h4>American Standard Bible Version</h4>
      </div>
      <SearchBible />
    </>
  );
};

export default HomeView