import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/system/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TableSortLabel from '@mui/material/TableSortLabel';
import Alert from '@mui/material/Alert';


const BASE_URL = 'https://rickandmortyapi.com/api/character';

const headCells = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'species', label: 'Species' },
  { id: 'status', label: 'Status' },
  { id: 'type', label: 'Type' },
];

function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // İlk sayfa numarası
  const [rowsPerPage, setRowsPerPage] = useState(5); // Sayfa başına gösterilecek karakter sayısı
  const [filters, setFilters] = useState({
    name: '',
    species: '',
    status: '',
    type: '',
  });
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    fetchAllCharacters();
  }, []); // Component yüklendiğinde veriyi çek

  const fetchAllCharacters = async () => {
    setLoading(true);
    try {
      let allCharacters = [];
      let nextPage = BASE_URL;
      
      while (nextPage) {
        const response = await axios.get(nextPage);
        allCharacters = [...allCharacters, ...response.data.results];
        nextPage = response.data.info.next; // Sonraki sayfa varsa devam et
      }

      setCharacters(allCharacters);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Sayfa değişikliği olduğunda ilk sayfaya dön
  };

  const handleFilterChange = (event, filterKey) => {
    setFilters({ ...filters, [filterKey]: event.target.value });
    setPage(0); // Filtre değişikliği olduğunda ilk sayfaya dön
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredCharacters = characters.filter((character) => {
    return (
      character.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      character.species.toLowerCase().includes(filters.species.toLowerCase()) &&
      character.status.toLowerCase().includes(filters.status.toLowerCase()) &&
      character.type.toLowerCase().includes(filters.type.toLowerCase())
    );
  });

  const sortedCharacters = filteredCharacters.sort((a, b) => {
    const isAsc = order === 'asc';
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          {headCells.slice(1).map((headCell) => (
            <TextField
              key={headCell.id}
              size='small'
              label={headCell.label}
              variant="outlined"
              value={filters[headCell.id]}
              onChange={(e) => handleFilterChange(e, headCell.id)}
            />
          ))}
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  {headCell.id !== 'image' ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCharacters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((character) => (
              <TableRow key={character.id}>
                <TableCell>
                  <img src={character.image} alt={character.name} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                </TableCell>
                {headCells.slice(1).map((headCell) => (
                  <TableCell key={headCell.id}>
                    {character[headCell.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500,826]}
        component="div"
        count={filteredCharacters.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

function App() {
  return (
    <div>
      <Characters />
    </div>
  );
}

export default App;
