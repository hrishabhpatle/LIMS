import { User, Component, Transaction, Notification } from '../types';

// Initialize with sample data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('users')) {
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@lab.com',
        role: 'Admin',
        password: 'admin123',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        username: 'user',
        email: 'user@lab.com',
        role: 'User',
        password: 'user123',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        username: 'lab_tech',
        email: 'labtech@lab.com',
        role: 'Lab Technician',
        password: 'tech123',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        username: 'researcher',
        email: 'researcher@lab.com',
        role: 'Researcher',
        password: 'research123',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        username: 'mfg_engineer',
        email: 'mfgeng@lab.com',
        role: 'Manufacturing Engineer',
        password: 'mfg123',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('components')) {
    const sampleComponents: Component[] = [
      // Resistors
      {
        id: '1',
        name: 'Resistor (100 Ohm, 1/4W)',
        manufacturer: 'Generic',
        partNumber: 'R100_1/4W',
        description: 'Carbon Film, 5% Tolerance',
        quantity: 500,
        location: 'R-Shelf-A1',
        unitPrice: 0.50,
        datasheetLink: '',
        category: 'Resistors',
        criticalLowThreshold: 100,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Resistor (1k Ohm, 1/4W)',
        manufacturer: 'Generic',
        partNumber: 'R1K_1/4W',
        description: 'Carbon Film, 5% Tolerance',
        quantity: 500,
        location: 'R-Shelf-A1',
        unitPrice: 0.50,
        datasheetLink: '',
        category: 'Resistors',
        criticalLowThreshold: 100,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Resistor (10k Ohm, 1/4W)',
        manufacturer: 'Generic',
        partNumber: 'R10K_1/4W',
        description: 'Carbon Film, 5% Tolerance',
        quantity: 500,
        location: 'R-Shelf-A1',
        unitPrice: 0.50,
        datasheetLink: '',
        category: 'Resistors',
        criticalLowThreshold: 100,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Resistor (4.7 Ohm, 1W)',
        manufacturer: 'Generic',
        partNumber: 'R4.7_1W',
        description: 'Metal Film, 1% Tolerance',
        quantity: 150,
        location: 'R-Shelf-A2',
        unitPrice: 1.20,
        datasheetLink: '',
        category: 'Resistors',
        criticalLowThreshold: 30,
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Capacitors
      {
        id: '5',
        name: 'Ceramic Cap (0.1uF, 50V)',
        manufacturer: 'Generic',
        partNumber: 'C0.1UF_50V_CER',
        description: 'Ceramic Disc Capacitor',
        quantity: 800,
        location: 'C-Bin-B1',
        unitPrice: 0.80,
        datasheetLink: '',
        category: 'Capacitors',
        criticalLowThreshold: 200,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        name: 'Electrolytic Cap (100uF, 25V)',
        manufacturer: 'Generic',
        partNumber: 'C100UF_25V_EL',
        description: 'Radial Electrolytic Capacitor',
        quantity: 25,
        location: 'C-Bin-B2',
        unitPrice: 2.50,
        datasheetLink: '',
        category: 'Capacitors',
        criticalLowThreshold: 50,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        lastOutwardDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        name: 'Tantalum Cap (10uF, 16V)',
        manufacturer: 'KEMET',
        partNumber: 'T491A106K016AT',
        description: 'SMD Tantalum Capacitor',
        quantity: 100,
        location: 'C-Bin-B3',
        unitPrice: 5.00,
        datasheetLink: '',
        category: 'Capacitors',
        criticalLowThreshold: 20,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Inductors
      {
        id: '8',
        name: 'Inductor (10uH)',
        manufacturer: 'Generic',
        partNumber: 'L10UH',
        description: 'Radial Lead Inductor',
        quantity: 100,
        location: 'L-Bin-C1',
        unitPrice: 3.00,
        datasheetLink: '',
        category: 'Inductors',
        criticalLowThreshold: 25,
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Diodes
      {
        id: '9',
        name: '1N4007 Diode',
        manufacturer: 'Fairchild',
        partNumber: '1N4007',
        description: 'Rectifier Diode, 1A, 1000V',
        quantity: 300,
        location: 'D-Bin-D1',
        unitPrice: 1.00,
        datasheetLink: '',
        category: 'Diodes',
        criticalLowThreshold: 75,
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '10',
        name: 'Zener Diode (5.1V, 0.5W)',
        manufacturer: 'ON Semiconductor',
        partNumber: '1N5231B',
        description: 'Zener Diode',
        quantity: 150,
        location: 'D-Bin-D2',
        unitPrice: 1.50,
        datasheetLink: '',
        category: 'Diodes',
        criticalLowThreshold: 30,
        createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Transistors
      {
        id: '11',
        name: 'NPN Transistor (BC547)',
        manufacturer: 'NXP',
        partNumber: 'BC547B',
        description: 'NPN BJT, General Purpose',
        quantity: 200,
        location: 'T-Tray-E1',
        unitPrice: 1.20,
        datasheetLink: '',
        category: 'Transistors',
        criticalLowThreshold: 50,
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '12',
        name: 'MOSFET (IRF540N)',
        manufacturer: 'Infineon',
        partNumber: 'IRF540N',
        description: 'N-Channel Power MOSFET',
        quantity: 50,
        location: 'T-Tray-E2',
        unitPrice: 25.00,
        datasheetLink: '',
        category: 'Transistors',
        criticalLowThreshold: 10,
        createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Integrated Circuits
      {
        id: '13',
        name: 'NE555 Timer IC',
        manufacturer: 'Texas Instruments',
        partNumber: 'NE555P',
        description: 'Precision Timer IC',
        quantity: 80,
        location: 'IC-Box-F1',
        unitPrice: 8.00,
        datasheetLink: '',
        category: 'Integrated Circuits (ICs)',
        criticalLowThreshold: 20,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '14',
        name: 'LM358 Op-Amp',
        manufacturer: 'STMicroelectronics',
        partNumber: 'LM358N',
        description: 'Dual Op-Amp',
        quantity: 15,
        location: 'IC-Box-F2',
        unitPrice: 6.00,
        datasheetLink: '',
        category: 'Integrated Circuits (ICs)',
        criticalLowThreshold: 25,
        createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        lastOutwardDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '15',
        name: 'ATmega328P (DIP)',
        manufacturer: 'Microchip',
        partNumber: 'ATMEGA328P-PU',
        description: 'Microcontroller, 8-bit',
        quantity: 30,
        location: 'IC-Box-F3',
        unitPrice: 150.00,
        datasheetLink: '',
        category: 'Integrated Circuits (ICs)',
        criticalLowThreshold: 5,
        createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '16',
        name: 'ESP32-WROOM-32U',
        manufacturer: 'Espressif',
        partNumber: 'ESP32-WROOM-32U',
        description: 'Wi-Fi & Bluetooth Module',
        quantity: 2,
        location: 'IC-Box-F4',
        unitPrice: 200.00,
        datasheetLink: '',
        category: 'Integrated Circuits (ICs)',
        criticalLowThreshold: 3,
        createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Connectors
      {
        id: '17',
        name: 'Male Header (2.54mm, 40-pin)',
        manufacturer: 'Generic',
        partNumber: 'HDR-M-2.54-40',
        description: 'Single Row Pin Header',
        quantity: 100,
        location: 'Conn-Drawer-G1',
        unitPrice: 3.50,
        datasheetLink: '',
        category: 'Connectors',
        criticalLowThreshold: 20,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '18',
        name: 'JST-XH Connector (2-pin)',
        manufacturer: 'JST',
        partNumber: 'B2B-XH-A(LF)(SN)',
        description: 'Through-hole, 2-pin',
        quantity: 50,
        location: 'Conn-Drawer-G2',
        unitPrice: 4.00,
        datasheetLink: '',
        category: 'Connectors',
        criticalLowThreshold: 10,
        createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Sensors
      {
        id: '19',
        name: 'DHT11 Temperature/Humidity',
        manufacturer: 'Aosong',
        partNumber: 'DHT11',
        description: 'Digital Temperature & Humidity Sensor',
        quantity: 15,
        location: 'Sensor-Bin-H1',
        unitPrice: 50.00,
        datasheetLink: '',
        category: 'Sensors',
        criticalLowThreshold: 3,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '20',
        name: 'Photoresistor (LDR)',
        manufacturer: 'Generic',
        partNumber: 'GL5516',
        description: 'Light Dependent Resistor',
        quantity: 30,
        location: 'Sensor-Bin-H2',
        unitPrice: 7.00,
        datasheetLink: '',
        category: 'Sensors',
        criticalLowThreshold: 5,
        createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Microcontrollers/Dev Boards
      {
        id: '21',
        name: 'Arduino Uno R3',
        manufacturer: 'Arduino',
        partNumber: 'A000066',
        description: 'Development Board',
        quantity: 5,
        location: 'DevBoard-Rack-I1',
        unitPrice: 800.00,
        datasheetLink: '',
        category: 'Microcontrollers/Development Boards',
        criticalLowThreshold: 1,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '22',
        name: 'Raspberry Pi Zero W',
        manufacturer: 'Raspberry Pi Found.',
        partNumber: 'RPI0W',
        description: 'Single-board Computer',
        quantity: 3,
        location: 'DevBoard-Rack-I2',
        unitPrice: 1200.00,
        datasheetLink: '',
        category: 'Microcontrollers/Development Boards',
        criticalLowThreshold: 1,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Switches/Buttons
      {
        id: '23',
        name: 'Tactile Push Button (6x6mm)',
        manufacturer: 'Generic',
        partNumber: 'BTN-TACT-6X6',
        description: 'Momentary Tactile Switch',
        quantity: 100,
        location: 'Switch-Box-J1',
        unitPrice: 1.00,
        datasheetLink: '',
        category: 'Switches/Buttons',
        criticalLowThreshold: 25,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '24',
        name: 'SPDT Slide Switch',
        manufacturer: 'Generic',
        partNumber: 'SW-SPDT-SLIDE',
        description: 'Single Pole Double Throw Slide Switch',
        quantity: 40,
        location: 'Switch-Box-J2',
        unitPrice: 3.00,
        datasheetLink: '',
        category: 'Switches/Buttons',
        criticalLowThreshold: 10,
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
      },
      // LEDs/Displays
      {
        id: '25',
        name: 'Red LED (5mm)',
        manufacturer: 'Generic',
        partNumber: 'LED-RED-5MM',
        description: 'Standard Red LED',
        quantity: 200,
        location: 'LED-Tray-K1',
        unitPrice: 0.80,
        datasheetLink: '',
        category: 'LEDs/Displays',
        criticalLowThreshold: 50,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '26',
        name: '16x2 LCD Display',
        manufacturer: 'Generic',
        partNumber: 'LCD1602',
        description: 'Character LCD Module',
        quantity: 10,
        location: 'LCD-Box-K2',
        unitPrice: 150.00,
        datasheetLink: '',
        category: 'LEDs/Displays',
        criticalLowThreshold: 2,
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Cables/Wires
      {
        id: '27',
        name: 'Jumper Wires (M-M, 40pc)',
        manufacturer: 'Generic',
        partNumber: 'JMP-MM-40',
        description: 'Male-to-Male Jumper Wires, assorted',
        quantity: 10,
        location: 'Cable-Bag-L1',
        unitPrice: 80.00,
        datasheetLink: '',
        category: 'Cables/Wires',
        criticalLowThreshold: 2,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '28',
        name: 'Hook-up Wire (22AWG, Red)',
        manufacturer: 'Generic',
        partNumber: 'WIRE-22AWG-RED',
        description: 'Solid Core Hook-up Wire, 10m roll',
        quantity: 5,
        location: 'Cable-Bag-L2',
        unitPrice: 150.00,
        datasheetLink: '',
        category: 'Cables/Wires',
        criticalLowThreshold: 1,
        createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
        lastOutwardDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Mechanical Parts/Hardware
      {
        id: '29',
        name: 'M3 Screws (10mm)',
        manufacturer: 'Generic',
        partNumber: 'SCR-M3-10MM',
        description: 'Phillips Head, Steel',
        quantity: 200,
        location: 'Mech-Bin-M1',
        unitPrice: 0.50,
        datasheetLink: '',
        category: 'Mechanical Parts/Hardware',
        criticalLowThreshold: 50,
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '30',
        name: 'Brass Standoffs (M3, 10mm)',
        manufacturer: 'Generic',
        partNumber: 'STDOFF-M3-10MM',
        description: 'Male-Female Standoff',
        quantity: 100,
        location: 'Mech-Bin-M2',
        unitPrice: 2.00,
        datasheetLink: '',
        category: 'Mechanical Parts/Hardware',
        criticalLowThreshold: 20,
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Miscellaneous Lab Supplies
      {
        id: '31',
        name: 'Solder Wire (0.8mm)',
        manufacturer: 'Generic',
        partNumber: 'SOLDER-0.8MM',
        description: 'Lead-free Solder, 100g roll',
        quantity: 5,
        location: 'Misc-Shelf-N1',
        unitPrice: 300.00,
        datasheetLink: '',
        category: 'Miscellaneous Lab Supplies',
        criticalLowThreshold: 1,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '32',
        name: 'Breadboard (Full Size)',
        manufacturer: 'Generic',
        partNumber: 'BRDBRD-FULL',
        description: '830 Tie Points',
        quantity: 10,
        location: 'Misc-Shelf-N2',
        unitPrice: 70.00,
        datasheetLink: '',
        category: 'Miscellaneous Lab Supplies',
        criticalLowThreshold: 2,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('components', JSON.stringify(sampleComponents));
  }

  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify([]));
  }

  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const getComponents = (): Component[] => {
  return JSON.parse(localStorage.getItem('components') || '[]');
};

export const getTransactions = (): Transaction[] => {
  return JSON.parse(localStorage.getItem('transactions') || '[]');
};

export const getNotifications = (): Notification[] => {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const saveComponents = (components: Component[]) => {
  localStorage.setItem('components', JSON.stringify(components));
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};