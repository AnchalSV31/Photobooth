import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./PhotoStudio.css";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

const filters = [
  "90s",
  "2000s",
  "Grainy",
  "Noir",
  "Fisheye",
  "Soft Glow",
  "Rose Gold",
  "Polaroid",
  "Glitch",
  "Crosshatch",
];


//add more features like 
//option for number of photo in a frame-- if one then it will be like instax polaroid picture, more options for 2,3 and 6 photos collage.

const PhotoStudio = () => {
  const [selectedFilter, setSelectedFilter] = useState("90s");
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [showPhotoCountSelection, setShowPhotoCountSelection] = useState(true);
  const [selectedPhotoCount, setSelectedPhotoCount] = useState(3);
  const [showStudio, setShowStudio] = useState(false);

  const webcamRef = useRef(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const getFilterClass = (filter) => {
    switch (filter.toLowerCase()) {
      case "90s":
        return "_90s";
      case "2000s":
        return "_2000s";
      case "Soft Glow":
        return "soft-glow";
      case "Rose Gold":
        return "rose-gold";
      default:
        return filter.toLowerCase();
    }
  };

  // Photo Count Selection Screen Component
const PhotoCountSelection = () => {
  const photoOptions = [
    { count: 1, label: "Single Shot", icon: "📸", description: "One perfect photo",preview: "▢" },
    { count: 2, label: "Double Take", icon: "📸📸", description: "Two great shots", preview: "▢\n▢"  },
    { count: 3, label: "Classic Strip", icon: "📸📸📸", description: "Traditional photo booth",preview: "▢\n▢\n▢" },
    { count: 6, label: "Full Strip", icon: "🎞️", description: "Complete photo session",preview: "▢▢\n▢▢\n▢▢" }
  ];

  const handlePhotoCountSelect = (count) => {
    setSelectedPhotoCount(count);
    setShowPhotoCountSelection(false);
    setShowStudio(true);
  };

  return (
    <motion.div
      className="photo-count-selection"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="selection-container">
        <h2 className="selection-title">Choose Your Photo Style</h2>
        <p className="selection-subtitle">How many photos would you like to take?</p>
        
        <div className="photo-options">
          {photoOptions.map((option) => (
            <motion.div
              key={option.count}
              className="photo-option"
              onClick={() => handlePhotoCountSelect(option.count)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="option-icon">{option.icon}</div>
              
              <br/>
              <h3 className="option-label">{option.label}</h3>
              
              <p className="option-count">{option.count} Photo{option.count > 1 ? 's' : ''}</p>
              
              <p className="option-description">{option.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="selection-footer">
          <p>✨All photos will have your selected filter applied</p>
        </div>
      </div>
    </motion.div>
  );
};

  const takePhoto = async () => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    let cssFilter = "none";
    switch (selectedFilter.toLowerCase()) {
      case "noir":
        cssFilter = "grayscale(1) contrast(0.8) brightness(1.1)";
        break;
      case "90s":
        cssFilter =
          "contrast(1.1) sepia(0.3) hue-rotate(-10deg) saturate(0.8) brightness(1.1)";
        break;
      case "grainy":
        cssFilter =
          "url('#grain') brightness(1.2)";
        break;
      case "2000s":
        cssFilter =
          "saturate(1.8) contrast(1.05) brightness(1.1) sepia(0.1) hue-rotate(10deg)";
        break;
      case "soft-glow":
        cssFilter= "brightness(1.1) contrast(0.9) saturate(1.1) blur(0.2px)";
        break;
      case "rose-gold":
        cssFilter= "hue-rotate(-15deg) saturate(1.3) brightness(1.08) contrast(1.1) sepia(0.1)";
        break;
      case "polaroid":
        cssFilter= "contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.2)";
        break;
      case "glitch":
        cssFilter = "contrast(1.5) saturate(2)";
        break;
      case "crosshatch":
        cssFilter = "grayscale(0.5) blur(1px)";
        break;
      case "fisheye":
        cssFilter = "brightness(1.1)";
        break;
    }

    ctx.filter = cssFilter;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const filteredImg = canvas.toDataURL("image/jpeg");
    setPhotos((prev) => [
      ...prev,
      { src: filteredImg, filter: selectedFilter },
    ]);
  };

  const countdownStep = async (value) => {
    setCountdown(value);
    await new Promise((r) => requestAnimationFrame(r));
    await delay(1000);
  };

  const startPhotoSequence = async () => {
    setIsCapturing(true);
    setPhotos([]);
    setShowResult(false);

    for (let i = 0; i < selectedPhotoCount; i++) {
      await countdownStep("3..");
      await countdownStep("2..");
      await countdownStep("1..");
      await countdownStep("Smile!");
      await takePhoto();
      setCountdown(null);

      const pauseTime=selectedPhotoCount>3 ? 800:500;
      await delay(pauseTime);
    }

    setIsCapturing(false);
    setShowResult(true);
  };

  const handleReshoot = () => {
    setPhotos([]);
    setShowResult(false);
    // Don't reset photo count, just go back to studio
    // setShowStudio(true);
  };

  const handleDownload = async () => {
    const frame = document.getElementById("photostrip-canvas-source");
    if (!frame) return;

    const canvas = await html2canvas(frame, { useCORS: true });
    const dataURL = canvas.toDataURL("image/jpeg");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "PixieBooth-strip.jpg";
    link.click();
  };

  const slideIn = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="photoStudio"
      variants={slideIn}
      initial="hidden"
      animate="visible"
    >
      {/* Photo Count Selection Screen */}
      {showPhotoCountSelection && <PhotoCountSelection />}

      {showStudio && !showResult && (
        <div className="studio-container">
          {/* Add selected count indicator */}
          <div className="photo-count-indicator">
            Taking {selectedPhotoCount} photo{selectedPhotoCount > 1 ? 's' : ''} 
            <span className="change-count" onClick={() => {
              setShowStudio(false);
              setShowPhotoCountSelection(true);
            }}>
              Change
            </span>
          </div>

          <div className="studio-webcam-container">
            {countdown && <div className="countdown-overlay">{countdown}</div>}

            <div className={`studio-webcam ${getFilterClass(selectedFilter)}`}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="webcam-view"
              />
            </div>
          </div>

          <div className="filter-bar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`filter-btn ${
                  selectedFilter === filter ? "active" : ""
                }`}
                disabled={isCapturing}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            className="capture-btn"
            onClick={startPhotoSequence}
            disabled={isCapturing}
          >
            Capture {selectedPhotoCount} Photo{selectedPhotoCount > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {showResult && (
        <div className="studio-result slide-in-top">
          <div
            className={`photostrip-frame count-${selectedPhotoCount} ${showResult ? "strip-slide-in" : ""}`}
            id="photostrip-canvas-source"
          >
            {/* Special container for 6-photo grid layout */}
          {selectedPhotoCount === 6 ? (
            <>
              <div className="photos-container">
                {photos.map((photo, idx) => (
                  <div className="strip-photo-wrapper" key={idx}>
                    <img
                      src={photo.src}
                      alt={`snap-${idx}`}
                      className={`strip-photo-img ${getFilterClass(photo.filter)}`}
                    />
                  </div>
                ))}
              </div>
              <p className="photostrip-caption">
                PixieBooth • {" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </>
          ) : (
            /* Regular vertical layout for 1, 2, 3 photos */
            <>
            {photos.map((photo, idx) => (
              <div className="strip-photo-wrapper" key={idx}>
                <img
                  src={photo.src}
                  alt={`snap-${idx}`}
                  className={`strip-photo-img ${getFilterClass(photo.filter)}`}
                />
              </div>
            ))}
            <p className="photostrip-caption">
              PixieBooth  • {" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            </>
          )}
          </div>

          <div className="result-controls">
            <button onClick={handleReshoot} className="reshoot">
              Reshoot
            </button>
            <button onClick={handleDownload} className="download">
              Download Strip
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PhotoStudio;
