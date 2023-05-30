const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  
  const file1 = fs.readFileSync('texto1.txt', 'utf8');
  const file2 = fs.readFileSync('texto2.txt', 'utf8');

  const similarity = calculateSimilarity(file1, file2);
  const similarParts = getSimilarParts(file1, file2);

  const markedText = markSimilarParts(file1, similarParts);


  const matchingCharacters = similarParts.length;
  const averageSimilarity = matchingCharacters / (file1.length + file2.length) * 100;

  res.send(`
    <html>
    <head>
      <title>Comparación de Texto</title>
      <style>
        .highlight {
          background-color: yellow;
        }
      </style>
    </head>
    <body>
      <h1>Similitud de Texto</h1>
      <p>Texto 1:</p>
      <pre>${file1}</pre>
      <p>Texto 2:</p>
      <pre>${file2}</pre>
      <p>Texto con partes similares señaladas:</p>
      <pre>${markedText}</pre>
      <p>Estadísticas de Similitud:</p>
      <p>Caracteres coincidentes: ${matchingCharacters}</p>
      <p>Similitud promedio: ${averageSimilarity.toFixed(2)}%</p>
    </body>
    </html>
  `);
});


function calculateSimilarity(text1, text2) {
  const length1 = text1.length;
  const length2 = text2.length;

  const maxLength = Math.max(length1, length2);
  const minLength = Math.min(length1, length2);

  let matchingChars = 0;

  for (let i = 0; i < minLength; i++) {
    if (text1[i] === text2[i]) {
      matchingChars++;
    }
  }

  return (matchingChars / maxLength) * 100;
}


function getSimilarParts(text1, text2) {
  const similarParts = [];
  const length = Math.min(text1.length, text2.length);

  for (let i = 0; i < length; i++) {
    if (text1[i] === text2[i]) {
      similarParts.push(i);
    }
  }

  return similarParts;
}


function markSimilarParts(text, similarParts) {
  let markedText = '';
  let prevIndex = -1;

  for (let i = 0; i < text.length; i++) {
    if (similarParts.includes(i)) {
      if (prevIndex === -1) {
        markedText += `<span class="highlight" title="Empieza una parte similar">${text[i]}`;
      } else if (i === text.length - 1 || !similarParts.includes(i + 1)) {
        markedText += `${text[i]}</span>`;
      } else {
        markedText += text[i];
      }
      prevIndex = i;
    } else {
      markedText += text[i];
    }
  }

  return markedText;
}

app.listen(8080, () => {
  console.log('El servidor está funcionando en http://localhost:8080/');
});

