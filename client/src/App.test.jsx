import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginUI from './boundary/LoginUI';
import Navbar from './components/Navbar';
import HomeownerManagementUI from './boundary/HomeownerManagementUI';
import CustomTableHomeowner from './components/CustomTableHomeowner';
import HomeownerShortlistManagementUI from './boundary/HomeownerShortlistManagementUI';
import HomeownerHistoryManagementUI from './boundary/HomeownerHistoryManagementUI';

describe('LoginUI integration test', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.alert = vi.fn();
    localStorage.clear();
  });

  test('logs in successfully with valid credentials', async () => {
    global.fetch.mockResolvedValueOnce({
       ok: true,
      json: async () => ({ success: true })
    });

    render(
      <BrowserRouter>
        <LoginUI />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'testpass' } });
    fireEvent.change(screen.getByTestId('profileType'), { target: { value: 'homeowner' } });

    fireEvent.click(screen.getByText(/Log In/i));

    await waitFor(() => {
      expect(localStorage.getItem('loggedInUser')).toBe('testuser');
      expect(localStorage.getItem('userType')).toBe('homeowner');
    });
  });

  test('shows alert on failed login', async () => {
    global.alert = vi.fn();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false })
    });

    render(
      <BrowserRouter>
        <LoginUI />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username'), { target: { value: 'baduser' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'badpass' } });
    fireEvent.change(screen.getByTestId('profileType'), { target: { value: 'cleaner' } });

    fireEvent.click(screen.getByText(/Log In/i));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Login failed.');
    });
  });
});


test('logout clears localStorage and redirects', () => {
  // Mock the fetch function to prevent actual network requests
  delete window.location;
  window.location = { href: '', assign: vi.fn() };

  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  // Open dropdown first by clicking profile toggle (circle + arrow)
  const profileToggle = screen.getByRole('navigation').querySelector('div[style*="cursor: pointer"]');
  fireEvent.click(profileToggle);

  // Now click the "↩ Log Out" button
  fireEvent.click(screen.getByText(/log out/i));

  expect(localStorage.getItem('loggedInUser')).toBeNull();
  expect(localStorage.getItem('userType')).toBeNull();
  expect(window.location.href).toBe('/');
});

describe('HomeownerManagementUI - Service View & Search', () => {
  beforeEach(() => {
    localStorage.setItem('loggedInUser', 'homeowner123');
    global.fetch = vi.fn();
  });

  test('displays all service', async () => {
    const mockServices = [
      { cleanerusername: 'cleanerA', cleaningservicename: 'Dust Away', price: 20, servicecategory: 'General', cleaningdescription: 'Basic clean', numofviews: 10, numofshortlist: 5 },
      { cleanerusername: 'cleanerB', cleaningservicename: 'Mop Masters', price: 25, servicecategory: 'Deep', cleaningdescription: 'Deep clean', numofviews: 8, numofshortlist: 3 }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices
    });

    render(<BrowserRouter><HomeownerManagementUI /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Dust Away')).toBeInTheDocument();
      expect(screen.getByText('Mop Masters')).toBeInTheDocument();
    });
  });

  test('filters services based on search input', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { cleanerusername: 'cleanerA', cleaningservicename: 'Dust Away', price: 20, servicecategory: 'General', cleaningdescription: 'Basic clean', numofviews: 10, numofshortlist: 5  },
        { cleanerusername: 'cleanerB', cleaningservicename: 'Mop Masters', price: 25, servicecategory: 'Deep', cleaningdescription: 'Deep clean', numofviews: 8, numofshortlist: 3  }
      ]
    });

    render(<BrowserRouter><HomeownerManagementUI /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getAllByTestId('service-row')).toHaveLength(2);
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { cleanerusername: 'cleanerB', 
          cleaningservicename: 'Mop Masters', 
          price: 25, 
          servicecategory: 'Deep', 
          cleaningdescription: 'Deep clean', 
          numofviews: 8, 
          numofshortlist: 3 }
      ]
    });

    fireEvent.change(screen.getByPlaceholderText(/search by service name/i), {
      target: { value: 'Mop' }
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId('service-row');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent('Mop Masters');
    });
  });
});

describe('Homeowner shortlist functionality', () => {
  const mockColumns = [
    { id: 'cleanerusername', label: 'Cleaner' },
    { id: 'cleaningservicename', label: 'Service Name' },
    { id: 'price', label: 'Price' },
    { id: 'servicecategory', label: 'Category' },
    { id: 'cleaningdescription', label: 'Description' },
    { id: 'numofviews', label: 'Views' },
    { id: 'numofshortlist', label: 'Shortlist' },
  ];

  const mockService = {
    cleanerusername: 'cleanerA',
    cleaningservicename: 'Dust Away',
    price: 20,
    servicecategory: 'General',
    cleaningdescription: 'Clean house',
    numofviews: 5,
    numofshortlist: 0,
    isShortlisted: false,
  };

  test('adds a service to shortlist when icon is clicked', () => {
    const onShortlistMock = vi.fn();

    render(
      <CustomTableHomeowner
        columns={mockColumns}
        data={[mockService]}
        onShortlist={onShortlistMock}
      />
    );

    // Locate the shortlist icon (bookmark image)
    const shortlistIcon = screen.getByRole('img', { name: /shortlist/i });

    // Click the icon
    fireEvent.click(shortlistIcon);

    // Verify the handler was called with correct arguments
    expect(onShortlistMock).toHaveBeenCalledWith(
      expect.objectContaining({ cleaningservicename: 'Dust Away' }),
      true
    );
  });
});

describe('HomeownerShortlistManagementUI - View & Search Shortlist', () => {
  beforeEach(() => {
    localStorage.setItem('loggedInUser', 'homeowner123');
    vi.restoreAllMocks();
  });

  test('displays all shortlisted services', async () => {
    const mockShortlisted = [
      {
        cleanerusername: 'cleanerA',
        cleaningservicename: 'Shiny Clean',
        price: 30,
        servicecategory: 'Premium',
        cleaningdescription: 'Full home shine',
        numofviews: 12,
        numofshortlist: 9,
        isShortlisted: true,
      },
      {
        cleanerusername: 'cleanerB',
        cleaningservicename: 'Fresh Start',
        price: 22,
        servicecategory: 'Basic',
        cleaningdescription: 'Quick tidy up',
        numofviews: 6,
        numofshortlist: 4,
        isShortlisted: true,
      }
    ];

    global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockShortlisted
    })
    .mockResolvedValueOnce({ // for searchShortlist()
      ok: true,
      json: async () => mockShortlisted
    });

    render(
      <BrowserRouter>
        <HomeownerShortlistManagementUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Shiny Clean')).toBeInTheDocument();
      expect(screen.getByText('Fresh Start')).toBeInTheDocument();
    });
  });

  test('filters shortlisted services based on search input', async () => {
    const mockShortlisted = [
      {
        cleanerusername: 'cleanerA',
        cleaningservicename: 'Shiny Clean',
        price: 30,
        servicecategory: 'Premium',
        cleaningdescription: 'Full home shine',
        numofviews: 12,
        numofshortlist: 9,
        isShortlisted: true,
      },
      {
        cleanerusername: 'cleanerB',
        cleaningservicename: 'Fresh Start',
        price: 22,
        servicecategory: 'Basic',
        cleaningdescription: 'Quick tidy up',
        numofviews: 6,
        numofshortlist: 4,
        isShortlisted: true,
      }
    ];

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockShortlisted // viewShortlist
      });

    render(
      <BrowserRouter>
        <HomeownerShortlistManagementUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('service-row')).toHaveLength(2);
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockShortlisted[0]] // second call (filtered)
    });

    fireEvent.change(screen.getByPlaceholderText(/search by service name/i), {
      target: { value: 'Shiny' }
    });

    await waitFor(() => {
      const filteredRows = screen.getAllByTestId('service-row');
      expect(filteredRows).toHaveLength(1);
      expect(filteredRows[0]).toHaveTextContent('Shiny Clean');
    });
  });
});

describe('HomeownerHistoryManagementUI – View & Search History', () => {
  const mockHistory = [
    {
      cleaningservicename: 'General Clean',
      cleanerusername: 'cleanerA',
      cleaningdate: '2024-01-01',
      homeownerusername: 'homeowner123',
      cleaninglocation: 'Block 123',
      cleaningstarttime: '10:00',
      cleaningendtime: '12:00'
    },
    {
      cleaningservicename: 'Deep Clean',
      cleanerusername: 'cleanerB',
      cleaningdate: '2024-02-01',
      homeownerusername: 'homeowner123',
      cleaninglocation: 'Block 456',
      cleaningstarttime: '14:00',
      cleaningendtime: '16:00'
    }
  ];

  beforeEach(() => {
    localStorage.setItem('loggedInUser', 'homeowner123');
    vi.restoreAllMocks();
  });

  test('displays all history services', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistory
    });

    render(
      <BrowserRouter>
        <HomeownerHistoryManagementUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByTestId('service-row');
      expect(rows).toHaveLength(2);
      expect(screen.getByText('General Clean')).toBeInTheDocument();
      expect(screen.getByText('Deep Clean')).toBeInTheDocument();
    });
  });

  test('filters history services based on search input', async () => {
    // First fetch: full history
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistory
    });

    render(
      <BrowserRouter>
        <HomeownerHistoryManagementUI />
      </BrowserRouter>
    );

    // Wait for full list to load
    await waitFor(() => {
      expect(screen.getAllByTestId('service-row')).toHaveLength(2);
    });

    // Second fetch: filtered search
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockHistory[1]] // Only "Deep Clean"
    });

    fireEvent.change(screen.getByPlaceholderText(/search by service name/i), {
      target: { value: 'Deep' }
    });

    await waitFor(() => {
      const filteredRows = screen.getAllByTestId('service-row');
      expect(filteredRows).toHaveLength(1);
      expect(filteredRows[0]).toHaveTextContent('Deep Clean');
    });
  });
});
