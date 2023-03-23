import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import morgan from 'morgan';
import yargs from 'yargs';

interface Args {
  port: number;
  nama: string;
}

const argv = yargs(process.argv.slice(2))
  .options({
    port: {
      alias: 'p',
      type: 'number',
      description: 'Angka port',
      default: 3000,
    },
    nama: {
      alias: 'n',
      type: 'string',
      description: 'Nama API',
      default: 'Gateway',
    },
  })
  .help()
  .alias('help', 'h')
  .parse() as Args;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'))

const layananSatu = async (): Promise<any> => {
  try {
    const response = await axios.get('http://localhost:3001/api/layanan-satu');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Gagal memanggil service:', error.message);
    } else {
      console.error('Gagal memanggil service:', error);
    }
    throw error;
  }
}

const layananDua = async (): Promise<any> => {
  try {
    const response = await axios.get('http://localhost:3002/api/layanan-dua');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Gagal memanggil service:', error.message);
    } else {
      console.error('Gagal memanggil service:', error);
    }
    throw error;
  }
}

if (argv.nama === 'Gateway') {
  app.get('/api/layanan-satu', async (req, res) => {
    try {
      const data = await layananSatu();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Gagal memanggil service' });
    }
  });
  app.get('/api/layanan-dua', async (req, res) => {
    try {
      const data = await layananDua();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Gagal memanggil service' });
    }
  });
} else {
  app.get('/api/layanan-satu', async (req, res) => {
    res.json({ message: 'Halo ini respon dari layanan satu!' });
  });
  app.get('/api/layanan-dua', async (req, res) => {
    res.json({ message: 'Halo ini respon dari layanan dua!' });
  });
}


app.listen(argv.port, () => {
  console.log(`API ${argv.nama} sudah berjalan pada port ${argv.port}`);
});
