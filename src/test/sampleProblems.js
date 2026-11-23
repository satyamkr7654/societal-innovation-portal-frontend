/** Fictional records used to demonstrate the portal. */
export const SAMPLE_PROBLEMS = [
  {
    id: 'JH-2026-WTR-0101',
    title: 'Contaminated drinking water supply & broken pipeline in Ward 12, Harmu',
    description:
      'The primary drinking water distribution pipe broke under the main road, mixing untreated sewage into tap water. Over 450 households are currently facing dysentery symptoms and muddy tap water output.',
    category: 'Water',
    status: 'ASSIGNED',
    rejectionReason: null,
    district: 'Ranchi',
    location: {
      address: 'Near Harmu Ground, Ward 12, Ranchi, Jharkhand 834002',
      lat: 23.3512,
      lng: 85.3129,
    },
    citizen: {
      id: 'usr_cit_01',
      name: 'Ramesh Kumar',
    },
    assignedUniversity: {
      id: 'univ_01',
      name: 'Palash Institute Innovation Lab',
      department: 'Department of Civil & Environmental Engineering',
      facultyLead: 'Dr. Anandita Sen',
      studentsCount: 4,
    },
    industrySupport: {
      sponsor: 'Shikhar Steel CSR',
      type: 'Funding & Flow Sensor Hardware',
      amount: '₹2,50,000',
    },
    photoUrl:
      'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-14T09:30:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-14T09:30:00Z',
        changedBy: 'Citizen Ramesh Kumar',
        remarks: 'Problem registered with photo evidence and GPS coordinates.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-09-15T11:15:00Z',
        changedBy: 'Govt. District Nodal Officer, Ranchi',
        remarks:
          'Physical inspection completed. Confirmed microbial contamination in pipeline.',
      },
      {
        stage: 'ASSIGNED',
        changedAt: '2026-09-17T14:00:00Z',
        changedBy: 'Dept. of Higher Education, Govt. of Jharkhand',
        remarks:
          'Assigned to Palash Institute for IoT pipeline leak detection prototype.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-SAN-0102',
    title: 'Open drainage overflow causing severe waterlogging during rains in Bank More',
    description:
      'Uncovered storm drains are chocked with plastic debris and silt, resulting in knee-deep contaminated flood water entering commercial market areas and school buses getting stranded.',
    category: 'Sanitation',
    status: 'IN_PROGRESS',
    rejectionReason: null,
    district: 'Dhanbad',
    location: {
      address: 'Purana Bazar Crossing, Bank More, Dhanbad, Jharkhand 826001',
      lat: 23.7957,
      lng: 86.4304,
    },
    citizen: {
      id: 'usr_cit_02',
      name: 'Pooja Verma',
    },
    assignedUniversity: {
      id: 'univ_02',
      name: 'Damodar Institute Civic Innovation Cell',
      department: 'Department of Mining & Environmental Engineering',
      facultyLead: 'Prof. R. N. Mukherjee',
      studentsCount: 5,
    },
    industrySupport: {
      sponsor: 'Kaushal Minerals CSR',
      type: 'Heavy Desilting Machinery & Polymer Covers',
      amount: '₹4,00,000',
    },
    photoUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-08T08:15:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-08T08:15:00Z',
        changedBy: 'Citizen Pooja Verma',
        remarks: 'Reported along with drain blockage photos.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-09-09T10:00:00Z',
        changedBy: 'Dhanbad Municipal Corporation Admin',
        remarks: 'Severe civic risk validated.',
      },
      {
        stage: 'ASSIGNED',
        changedAt: '2026-09-11T12:30:00Z',
        changedBy: 'State Innovation Council',
        remarks: 'Allocated to Damodar Institute for gravity-assisted silt trap design.',
      },
      {
        stage: 'IN_PROGRESS',
        changedAt: '2026-09-18T16:00:00Z',
        changedBy: 'Damodar Institute Team Lead',
        remarks:
          'Milestone 2 reached: Modular silt filtration grates installed on trial stretch.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-HLT-0103',
    title:
      'Non-functional cold chain vaccine refrigeration at Primary Health Center, Torpa',
    description:
      'Frequent power cuts and inverter battery failures in Torpa rural clinic are ruining infant immunization vaccines (Polio, BCG, Hepatitis). A solar-assisted DC cooling mechanism is urgently required.',
    category: 'Health',
    status: 'VALIDATED',
    rejectionReason: null,
    district: 'Khunti',
    location: {
      address: 'PHC Campus, Main Road Torpa, Khunti, Jharkhand 835227',
      lat: 22.9567,
      lng: 85.0894,
    },
    citizen: {
      id: 'usr_cit_03',
      name: 'Dr. Alok Tirkey',
    },
    assignedUniversity: null,
    industrySupport: null,
    photoUrl:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-21T11:45:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-21T11:45:00Z',
        changedBy: 'Citizen Dr. Alok Tirkey',
        remarks: 'Reported critical vaccine spoilage issue.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-09-23T14:20:00Z',
        changedBy: 'Chief Medical Officer, Khunti',
        remarks: 'Approved for university solar refrigeration assignment.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-AGR-0104',
    title:
      'Lack of micro-irrigation facilities for smallholder tribal paddy farmers in Gola',
    description:
      'Over 80 smallholder farmers rely entirely on irregular monsoon rain, despite proximity to the Subarnarekha tributary. Low-cost solar lift irrigation with community drip lines would double crop cycles.',
    category: 'Agriculture',
    status: 'IN_PROGRESS',
    rejectionReason: null,
    district: 'Ramgarh',
    location: {
      address: 'Barlanga Village, Gola Block, Ramgarh, Jharkhand 829110',
      lat: 23.5358,
      lng: 85.7176,
    },
    citizen: {
      id: 'usr_cit_04',
      name: 'Shambu Mahto',
    },
    assignedUniversity: {
      id: 'univ_03',
      name: 'Sakhua Agricultural University',
      department: 'Department of Agricultural Engineering',
      facultyLead: 'Dr. Manoj Soren',
      studentsCount: 6,
    },
    industrySupport: {
      sponsor: 'Girija Metals CSR',
      type: 'Solar Submersible Pumps & HDPE Pipelines',
      amount: '₹3,50,000',
    },
    photoUrl:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-02T07:30:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-02T07:30:00Z',
        changedBy: 'Citizen Shambu Mahto',
        remarks: 'Submitted request on behalf of Gola farmers cooperative.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-09-04T12:00:00Z',
        changedBy: 'District Agriculture Officer, Ramgarh',
        remarks: 'High impact project verified.',
      },
      {
        stage: 'ASSIGNED',
        changedAt: '2026-09-06T15:30:00Z',
        changedBy: 'Govt Nodal Desk',
        remarks: 'Assigned to Sakhua Agricultural University faculty.',
      },
      {
        stage: 'IN_PROGRESS',
        changedAt: '2026-09-16T11:00:00Z',
        changedBy: 'Sakhua Project Team',
        remarks:
          'Milestone 2: Solar pump foundation constructed and test boring completed.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-EDU-0105',
    title:
      'Dilapidated government middle school ceiling leaking near computer laboratory',
    description:
      'Heavy rainwater seepage from cracked roof slab threatens 15 newly donated desktop computers and creates electric shock hazards for 220 rural students in Chas block.',
    category: 'Education',
    status: 'SUBMITTED',
    rejectionReason: null,
    district: 'Bokaro',
    location: {
      address: 'Govt Middle School, Chas Rural, Bokaro, Jharkhand 827013',
      lat: 23.6366,
      lng: 86.1772,
    },
    citizen: {
      id: 'usr_cit_05',
      name: 'Sunita Devi',
    },
    assignedUniversity: null,
    industrySupport: null,
    photoUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-25T14:10:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-25T14:10:00Z',
        changedBy: 'Citizen Sunita Devi',
        remarks: 'Complaint registered by School Management Committee member.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-INF-0106',
    title: 'Caved-in culvert road causing fatal traffic gridlocks near Mango bridge',
    description:
      'A century-old stone culvert on the access road collapsed during flash floods. Student innovation team designed an emergency rapid-curing precast modular bridge deck.',
    category: 'Infrastructure',
    status: 'SOLVED',
    rejectionReason: null,
    district: 'East Singhbhum',
    location: {
      address: 'Old Purulia Road, Mango, Jamshedpur, Jharkhand 831012',
      lat: 22.8214,
      lng: 86.2081,
    },
    citizen: {
      id: 'usr_cit_06',
      name: 'Vikramaditya Roy',
    },
    assignedUniversity: {
      id: 'univ_04',
      name: 'Subarna Institute Civil Engineering Cell',
      department: 'Structural Engineering Division',
      facultyLead: 'Dr. Pradeep Mishra',
      studentsCount: 4,
    },
    industrySupport: {
      sponsor: 'Mahua Motors CSR',
      type: 'Structural Steel Beams & Concrete Mix',
      amount: '₹5,50,000',
    },
    photoUrl:
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-08-10T10:00:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-08-10T10:00:00Z',
        changedBy: 'Citizen Vikramaditya Roy',
        remarks: 'Reported urgent road sinkhole.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-08-11T13:30:00Z',
        changedBy: 'Executive Engineer, PWD Jamshedpur',
        remarks: 'High priority hazard verified.',
      },
      {
        stage: 'ASSIGNED',
        changedAt: '2026-08-13T16:00:00Z',
        changedBy: 'Govt Innovation Portal',
        remarks: 'Assigned to Subarna Institute.',
      },
      {
        stage: 'IN_PROGRESS',
        changedAt: '2026-08-25T11:00:00Z',
        changedBy: 'Subarna Project Team',
        remarks: 'Modular precast arch successfully set in place.',
      },
      {
        stage: 'SOLVED',
        changedAt: '2026-09-12T17:30:00Z',
        changedBy: 'District Magistrate Office, East Singhbhum',
        remarks:
          'Load test passed (20 tonnes). Culvert road re-opened for civilian traffic.',
      },
    ],
    feedback: {
      rating: 5,
      comment:
        'Superb rapid response by Subarna Institute students and Mahua Motors. Traffic restored within weeks!',
      submittedAt: '2026-09-14T08:00:00Z',
    },
  },
  {
    id: 'JH-2026-ENV-0107',
    title:
      'Fly-ash runoff from industrial haul roads contaminating local agricultural pond',
    description:
      'Uncontrolled coal transport trucks deposit dense toxic fly ash on road margins, which washes into the community water body during monsoon, threatening freshwater fish farming and cattle.',
    category: 'Environment',
    status: 'ASSIGNED',
    rejectionReason: null,
    district: 'Hazaribagh',
    location: {
      address: 'Barkagaon Industrial Corridor, Hazaribagh, Jharkhand 825311',
      lat: 23.8569,
      lng: 85.2217,
    },
    citizen: {
      id: 'usr_cit_07',
      name: 'Devendra Oraon',
    },
    assignedUniversity: {
      id: 'univ_05',
      name: 'Koel Valley University',
      department: 'Department of Biotechnology & Environmental Sciences',
      facultyLead: 'Dr. Kalpana Kumari',
      studentsCount: 3,
    },
    industrySupport: null,
    photoUrl:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-18T16:00:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-18T16:00:00Z',
        changedBy: 'Citizen Devendra Oraon',
        remarks: 'Complaint lodged with water sample photos.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-09-20T10:30:00Z',
        changedBy: 'Pollution Control Board Inspector, Hazaribagh',
        remarks: 'Suspended solids confirmed above safe limits.',
      },
      {
        stage: 'ASSIGNED',
        changedAt: '2026-09-22T14:45:00Z',
        changedBy: 'Govt Admin Portal',
        remarks:
          'Assigned to Koel Valley University for bio-retention wetland filtration solution.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-NRG-0108',
    title: 'Severe low-voltage power fluctuations burning community drinking borewells',
    description:
      'Sub-station voltage drops to under 130V during evening hours, frequently burning 5HP submersible water pump motor windings. 350 families left without water for weeks.',
    category: 'Energy',
    status: 'SUBMITTED',
    rejectionReason: null,
    district: 'Dumka',
    location: {
      address: 'Pattabari Village, Shikaripara, Dumka, Jharkhand 816118',
      lat: 24.2372,
      lng: 87.5256,
    },
    citizen: {
      id: 'usr_cit_08',
      name: 'Bimal Hansda',
    },
    assignedUniversity: null,
    industrySupport: null,
    photoUrl:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-24T18:20:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-24T18:20:00Z',
        changedBy: 'Citizen Bimal Hansda',
        remarks: 'Problem filed under Energy category.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-SAN-0109',
    title:
      'Illegal dumping of biomedical and commercial waste near public park in Chaibasa',
    description:
      'Complaint regarding unauthorized dumping of plastic containers near the public park.',
    category: 'Sanitation',
    status: 'REJECTED',
    rejectionReason:
      'Duplicate grievance. The same municipal issue is already registered under Case #JH-2026-SAN-0084 and cleanup tenders have been awarded by Chaibasa Municipality.',
    district: 'West Singhbhum',
    location: {
      address: 'Near Jubilee Lake Park, Chaibasa, West Singhbhum, Jharkhand 833201',
      lat: 22.5518,
      lng: 85.8078,
    },
    citizen: {
      id: 'usr_cit_09',
      name: 'Mohit Agarwal',
    },
    assignedUniversity: null,
    industrySupport: null,
    photoUrl:
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-09-12T12:00:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-09-12T12:00:00Z',
        changedBy: 'Citizen Mohit Agarwal',
        remarks: 'Reported illegal garbage dumping.',
      },
      {
        stage: 'REJECTED',
        changedAt: '2026-09-13T15:00:00Z',
        changedBy: 'Municipal Commissioner, Chaibasa',
        remarks: 'Rejected as duplicate of active project #JH-2026-SAN-0084.',
      },
    ],
    feedback: null,
  },
  {
    id: 'JH-2026-INF-0110',
    title:
      'Solar streetlights non-operational on high-accident blind curve on Kanke Road',
    description:
      'Over 2.5 km of rural stretch between Kanke Dam and Sukurhutu has complete darkness at night. 4 major road accidents occurred in the last two months due to battery failure.',
    category: 'Infrastructure',
    status: 'SOLVED',
    rejectionReason: null,
    district: 'Ranchi',
    location: {
      address: 'Kanke Dam Approach Curve, Ranchi, Jharkhand 834006',
      lat: 23.4215,
      lng: 85.3218,
    },
    citizen: {
      id: 'usr_cit_01',
      name: 'Ramesh Kumar',
    },
    assignedUniversity: {
      id: 'univ_01',
      name: 'Palash Institute Electrical & Electronics Cell',
      department: 'Department of Electrical Engineering',
      facultyLead: 'Prof. D. K. Tanti',
      studentsCount: 3,
    },
    industrySupport: {
      sponsor: 'Arunoday Power CSR',
      type: 'LiFePO4 Solar Batteries & Smart Luminaire Kits',
      amount: '₹1,80,000',
    },
    photoUrl:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-08-15T09:00:00Z',
    statusHistory: [
      {
        stage: 'SUBMITTED',
        changedAt: '2026-08-15T09:00:00Z',
        changedBy: 'Citizen Ramesh Kumar',
        remarks: 'Reported dangerous blind curve lighting failure.',
      },
      {
        stage: 'VALIDATED',
        changedAt: '2026-08-16T11:30:00Z',
        changedBy: 'Ranchi Traffic Police Nodal Officer',
        remarks: 'Accident zone verified.',
      },
      {
        stage: 'ASSIGNED',
        changedAt: '2026-08-18T14:00:00Z',
        changedBy: 'State Innovation Portal',
        remarks: 'Assigned to Palash Institute students for smart lighting retrofit.',
      },
      {
        stage: 'IN_PROGRESS',
        changedAt: '2026-08-28T16:00:00Z',
        changedBy: 'Palash Institute Student Lead',
        remarks: 'IoT auto-dimming LED arrays assembled and lab-tested.',
      },
      {
        stage: 'SOLVED',
        changedAt: '2026-09-10T19:00:00Z',
        changedBy: 'Joint Inspection Committee (RMC & Traffic Police)',
        remarks: 'All 18 solar lights operational with automated dusk-to-dawn sensors.',
      },
    ],
    feedback: {
      rating: 5,
      comment:
        'Excellent illumination at night now. Accidents have completely stopped on this turn. Great work!',
      submittedAt: '2026-09-12T10:00:00Z',
    },
  },
];
