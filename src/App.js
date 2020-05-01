import React, { useState } from 'react';
import { Grid, Typography, Button, Paper, Box, TextField } from '@material-ui/core';
import './App.css';

function shiftUp(s, k) {
  let n = 26;
  if (k < 0) return shiftUp(s, k + n);
  return s.split('')
    .map((c) => {
      if (c.match(/[a-z]/i)) {
        let code = c.charCodeAt();
        let shift = code >= 65 && code <= 90 ? 65 : code >= 97 && code <= 122 ? 97 : 0;
        return String.fromCharCode(((code - shift + k) % n) + shift);
      }
      return c;
    }).join('');
}

function gerarAlfabetos(input) {
  let contador = [],
    alfabetos = [],
    chars = input.split(''),
    length = chars.length,
    i;
  for (i = 0; i < length; i++) contador[i] = 0;
  alfabetos.push(input);
  i = 0;
  while (i < length) {
    if (contador[i] < i) {
      swap(chars, i % 2 === 1 ? contador[i] : 0, i);
      contador[i]++;
      i = 0;
      alfabetos.push(chars.join(''));
    } else {
      contador[i] = 0;
      i++;
    }
  }
  return alfabetos;
}

function swap(chars, i, j) {
  let tmp = chars[i];
  chars[i] = chars[j];
  chars[j] = tmp;
}

function App() {

  const [textoCifrado, setTextoCifrado] = useState('')
  const [dicionario, setDicionario] = useState([])
  const [dicCesar, setDicCesar] = useState([])
  const [possibilidades, setPossibilidades] = useState([])
  const [maisProvaveis, setMaisProvaveis] = useState([])
  const [alfabetos] = useState(gerarAlfabetos("cleopatr"))
  const [mono, setMono] = useState([])

  function lerDicionario(e) {
    let reader = new FileReader()
    reader.readAsBinaryString(e.target.files[0])
    reader.onload = (e) => {
      const palavras = e.target.result.split('\n')
      let palavrasFiltradas = []
      for (let i = 0; i < palavras.length; i++) {
        const element = palavras[i];
        if (element.search(/([bdfghijkmnqsuvwxyz])/g) === -1) palavrasFiltradas.push(element)
      }
      setDicionario(palavrasFiltradas);
      setDicCesar(e.target.result.split('\n'))
    }
  }

  function lerPalavra(e) {
    let reader = new FileReader()
    reader.readAsBinaryString(e.target.files[0])
    reader.onload = (e) => {
      setTextoCifrado(e.target.result)
    }
  }

  function decriptarCesar() {
    let alternativas = [],
      igualDic = []
    for (let i = 0; i < 26; i++) {
      const texto = shiftUp(textoCifrado, i)
      alternativas.push(texto)
      for (let j = 0; j < dicCesar.length; j++) {
        const element = dicCesar[j].trim()
        if (texto === element) igualDic.push(texto)
      }
    }
    setPossibilidades(alternativas)
    setMaisProvaveis(igualDic)
  }

  function decriptarMono() {
    const alfabetoReal = ['c', 'l', 'e', 'o', 'p', 'a', 't', 'r']
    let igualDic = [],
      possibilidades = []
    for (let i = 0; i < alfabetos.length; i++) {
      const alfabeto = alfabetos[i].split('');
      let temp = []
      for (let j = 0; j < textoCifrado.length; j++) {
        const letraTexto = textoCifrado.split('')[j];
        for (let k = 0; k < alfabeto.length; k++) {
          const letraAlfa = alfabeto[k];
          if (letraTexto === letraAlfa) temp.push(alfabetoReal[k])
        }
      }
      possibilidades.push({ palavra: temp.join(''), alfabeto })
    }

    for (let i = 0; i < dicionario.length; i++) {
      const element = dicionario[i].trim()
      if (textoCifrado.length === element.length) {
        for (let j = 0; j < possibilidades.length; j++) {
          const possibilidade = possibilidades[j];
          if (possibilidade.palavra === element) {
            igualDic.push(possibilidade)
            break
          }
        }
      }
    }
    setMono(igualDic)
  }

  return (
    <Grid container spacing={2} style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', textAlign: 'center' }} >
      <Grid item xs={4} component={Paper}>
        {possibilidades.length > 0 && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant={"h4"}>Resultado cifra de cesar</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant={"body1"}>Palavras encontradas no dicionario</Typography>
              {maisProvaveis.map(item => (
                <Box key={item} display='block'>{item}</Box>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant={"body1"}>Outras possibilidades</Typography>
              {possibilidades.map(item => (
                <Box key={item} display='block'>{item}</Box>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={4} component={Paper}>
        <Grid container >
          <Grid item xs={12}>
            <Typography variant={"h2"}>Decriptografador</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button color='primary' fullWidth variant='contained' onClick={() => document.getElementById('dicionario').click()}>
              {dicCesar.length > 0 && (
                <svg height="24px" viewBox="0 0 24 24" width="24px">
                  <path d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill='limegreen' />
                </svg>
              )}
              &nbsp;
              Importar Dicionário
            </Button>
            <input type='file' id='dicionario' onChange={lerDicionario} hidden />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button color='primary' fullWidth variant='contained' onClick={() => document.getElementById('palavraCifrada').click()}>
              {textoCifrado.length > 0 && (
                <svg height="24px" viewBox="0 0 24 24" width="24px" >
                  <path d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill='limegreen' />
                </svg>
              )}
              &nbsp;
              Importar Palavra Cifrada
            </Button>
            <input type='file' id='palavraCifrada' onChange={lerPalavra} hidden />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label='Palavra Cifrada' variant='outlined' margin='dense' value={textoCifrado} onChange={e => setTextoCifrado(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button color='primary' fullWidth variant='contained' onClick={decriptarCesar} disabled={dicCesar.length === 0 || textoCifrado.length === 0}>Decriptar Cesar</Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button color='secondary' fullWidth variant='contained' onClick={decriptarMono} disabled={dicCesar.length === 0 || textoCifrado.length === 0}>Decriptar Mono</Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4} component={Paper}>
        {mono.length > 0 && (
          <Grid container >
            <Grid item xs={12}>
              <Typography variant={"h4"}>Resultado cifra monoalfabetica</Typography>
            </Grid>
            <Grid item xs={6} >
              <Typography variant={"body1"}>Palavra encontrada</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant={"body1"}>Alfabeto utilizado</Typography>
            </Grid>
            <Grid item xs={6} >
              {mono.map(item => (
                <Box key={item.palavra} display='block'>{item.palavra}</Box>
              ))}
            </Grid>
            <Grid item xs={6} >
              {mono.map(item => (
                <Box key={item.alfabeto} display='block'>{item.alfabeto}</Box>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
