import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Search, Filter, Upload, Users, Building2, FileCheck, Award, X, Briefcase } from 'lucide-react';
import './App.css';

function App() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [filterGP, setFilterGP] = useState('');
  const [filterLSP, setFilterLSP] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Daftar jabatan sesuai urutan yang diminta
  const jabatanList = [
    'Security Officer',
    'Team Leader Security Officer',
    'Asst Leader Security Officer',
    'Koord Security Officer',
    'Koordinator Lapangan',
    'Safety Officer',
    'Driver',
    'Cleaning Service',
    'Kebersihan Umum',
    'Pramubakti',
    'Frontdesk / Front Desk',
    'Resepsionis',
    'Admin',
    'HRD',
    'Finance',
    'Direktur',
    'Direktur Utama',
    'Kepala Cabang',
    'Sekretaris',
    'Operator',
    'Produksi',
    'Mekanik',
    'Logistik',
    'Checker / Cheker',
    'SPOTTER / CHEKER',
    'Survey',
    'Surveyor',
    'Paramedic',
    'Blasting',
    'Sales Motoris',
    'Sales Associate',
    'SPG / SPG MT',
    'CSR',
    'CSO',
    'Binlat',
    'Trainer'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

 useEffect(() => {
  applyFilters();
}, [applyFilters]);

  const loadInitialData = async () => {
    try {
      const response = await fetch('/Database 160825.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
      
      if (jsonData.length > 1) {
        
        const dataRows = jsonData.slice(1).map((row, idx) => ({
            no: idx + 1,
            site: row[0] || '',
            posAbsen: row[1] || '',
            posisiJabatan: row[2] || '',
            nama: row[3] || '',
            KodeAbsen: row[4] || '',
            gp: row[5] || '',
            lsp: row[6] || ''
        })).filter(item => item.nama);
        
        setAllData(dataRows);
        const uniqueSites = [...new Set(dataRows.map(d => d.site))].filter(Boolean).sort();
        setSites(uniqueSites);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
        
        if (jsonData.length > 1) {
          const dataRows = jsonData.slice(1).map((row, idx) => ({
            no: idx + 1,
            site: row[0] || '',
            posAbsen: row[1] || '',
            posisiJabatan: row[2] || '',
            nama: row[3] || '',
            KodeAbsen: row[4] || '',
            gp: row[5] || '',
            lsp: row[6] || ''
          })).filter(item => item.nama);
          
          setAllData(dataRows);
          const uniqueSites = [...new Set(dataRows.map(d => d.site))].filter(Boolean).sort();
          setSites(uniqueSites);
          alert(`Berhasil import ${dataRows.length} data petugas!`);
        }
      } catch (err) {
        alert('Error membaca file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const applyFilters = useCallback(() => {
  let filtered = [...allData];

  if (searchTerm) {
    filtered = filtered.filter(item =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterSite) {
    filtered = filtered.filter(item => item.site === filterSite);
  }

  if (filterJabatan) {
    filtered = filtered.filter(item => {
      const jabatan = item.posisiJabatan.toLowerCase().trim();
      const filterJab = filterJabatan.toLowerCase().trim();
      return jabatan.includes(filterJab) || filterJab.includes(jabatan);
    });
  }

  if (filterGP) {
    if (filterGP === 'ADA') {
      filtered = filtered.filter(item => item.gp && item.gp.toString().trim() !== '');
    } else if (filterGP === 'TIDAK ADA') {
      filtered = filtered.filter(item => !item.gp || item.gp.toString().trim() === '');
    }
  }

  if (filterLSP) {
    if (filterLSP === 'ADA') {
      filtered = filtered.filter(item => item.lsp && item.lsp.toString().trim() !== '');
    } else if (filterLSP === 'TIDAK ADA') {
      filtered = filtered.filter(item => !item.lsp || item.lsp.toString().trim() === '');
    }
  }

  setFilteredData(filtered);

}, [allData, searchTerm, filterSite, filterGP, filterLSP, filterJabatan]);


  const resetFilters = () => {
    setSearchTerm('');
    setFilterSite('');
    setFilterGP('');
    setFilterLSP('');
    setFilterJabatan('');
  };

  const getGPStatus = (gp) => {
    return gp && gp.toString().trim() !== '' ? 'ADA' : 'TIDAK ADA';
  };

  const getLSPStatus = (lsp) => {
    return lsp && lsp.toString().trim() !== '' ? 'ADA' : 'TIDAK ADA';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#374151', fontSize: '18px', fontWeight: '500' }}>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={40} color="#2563eb" />
              <div>
                <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Sistem Manajemen Petugas</h1>
                <p style={{ color: '#6b7280', margin: 0 }}>Alumada Artha Prima</p>
              </div>
            </div>
            <div>
              <label style={{ cursor: 'pointer', background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                <Upload size={20} />
                <span>Upload Excel</span>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Filter size={24} color="#2563eb" />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Filter & Pencarian</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {/* Search */}
            <div style={{ gridColumn: window.innerWidth < 768 ? 'span 1' : 'span 2' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                <Search size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Cari Nama Petugas
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ketik nama petugas..."
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              />
            </div>

            {/* Filter SITE */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                <Building2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Filter SITE
              </label>
              <select
                value={filterSite}
                onChange={(e) => setFilterSite(e.target.value)}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              >
                <option value="">Semua SITE</option>
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>

            {/* Filter Jabatan */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                <Briefcase size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Filter Jabatan
              </label>
              <select
                value={filterJabatan}
                onChange={(e) => setFilterJabatan(e.target.value)}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              >
                <option value="">Semua Jabatan</option>
                {jabatanList.map((jabatan, idx) => (
                  <option key={idx} value={jabatan}>{jabatan}</option>
                ))}
              </select>
            </div>

            {/* Filter GP */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                <FileCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Filter GP
              </label>
              <select
                value={filterGP}
                onChange={(e) => setFilterGP(e.target.value)}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              >
                <option value="">Semua Status</option>
                <option value="ADA">Ada GP</option>
                <option value="TIDAK ADA">Tidak Ada GP</option>
              </select>
            </div>

            {/* Filter LSP */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                <Award size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Filter LSP
              </label>
              <select
                value={filterLSP}
                onChange={(e) => setFilterLSP(e.target.value)}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              >
                <option value="">Semua Status</option>
                <option value="ADA">Ada LSP</option>
                <option value="TIDAK ADA">Tidak Ada LSP</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Menampilkan <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{filteredData.length}</span> dari {allData.length} data
            </p>
            <button
              onClick={resetFilters}
              style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={16} />
              Reset Filter
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}>
                <tr>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>No</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>SITE</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Pos Absen</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>NAMA</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>kode Absen</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>JABATAN</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>GP</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>LSP</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                      <Users size={48} style={{ margin: '0 auto 12px', color: '#9ca3af' }} />
                      <p style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0' }}>Tidak ada data ditemukan</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>Coba ubah filter atau upload data Excel</p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111827' }}>{idx + 1}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827', whiteSpace: 'nowrap' }}>{item.site}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111827' }}>{item.posAbsen}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827', whiteSpace: 'nowrap' }}>{item.nama}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827', whiteSpace: 'nowrap' }}>{item.KodeAbsen}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111827', whiteSpace: 'nowrap' }}>{item.posisiJabatan}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '9999px',
                          background: getGPStatus(item.gp) === 'ADA' ? '#dcfce7' : '#fee2e2',
                          color: getGPStatus(item.gp) === 'ADA' ? '#166534' : '#991b1b',
                          whiteSpace: 'nowrap'
                        }}>
                          {getGPStatus(item.gp)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '9999px',
                          background: getLSPStatus(item.lsp) === 'ADA' ? '#dcfce7' : '#fee2e2',
                          color: getLSPStatus(item.lsp) === 'ADA' ? '#166534' : '#991b1b',
                          whiteSpace: 'nowrap'
                        }}>
                          {getLSPStatus(item.lsp)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
