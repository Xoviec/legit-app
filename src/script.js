export const Script = () =>{
    const headingArray = [
        "JUŻ WKRÓTCE",
        "START W STYCZNIU",
        "ZOSTAŃ Z NAMI",
        // Add more strings as needed
      ];
      
      // Initialize variables
      let typeJsText = document.querySelector(".heading-secondary");
      let cursor = document.querySelector(".cursor");
      let stringIndex = 0;
      let charIndex = 0;
      let isTyping = true;
      let typingDelay = 160; // Delay between typing characters
      let erasingDelay = 45; // Delay between erasing characters
      let pauseDelay = 3500; // Delay after a word is fully typed
      let postErasePause = 400; // Quick pause after erasing before typing next
      
      function typeJs() {
        if (stringIndex < headingArray.length) {
          const currentString = headingArray[stringIndex];
      
          if (isTyping) {
            if (charIndex < currentString.length) {
              typeJsText.innerHTML += currentString.charAt(charIndex);
              charIndex++;
              setTimeout(typeJs, typingDelay); // Continue typing
            } else {
              setTimeout(() => {
                isTyping = false;
                typeJs(); // Start erasing after the pause
              }, pauseDelay); // Pause after typing the full word
            }
          } else {
            if (charIndex > 0) {
              charIndex--;
              typeJsText.innerHTML = currentString.substring(0, charIndex);
              setTimeout(typeJs, erasingDelay); // Continue erasing faster
            } else {
              setTimeout(() => {
                stringIndex++;
                if (stringIndex >= headingArray.length) {
                  stringIndex = 0;
                }
                isTyping = true;
                charIndex = 0;
                typeJs(); // Start typing the next string after the pause
              }, postErasePause); // Quick pause after erasing
            }
          }
        }
      }
      
      // Start the typing effect
      typeJs();
      
      // tollbar mobile fix
      const viewportHeight =
        window.innerHeight - (window.safeAreaInsets?.bottom ?? 0);
      document.documentElement.style.setProperty("--vh", `${viewportHeight}px`);
      
      // copyright year
      const currentYear = new Date().getFullYear();
      console.log(currentYear);
      document.getElementById("currentYear").textContent = currentYear;
}