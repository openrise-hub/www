'use client';

interface MatrixRow {
  dimension: string;
  openrise: string;
  saas: string;
  abandoned: string;
  isPositive: boolean;
}

const MATRIX_ROWS: MatrixRow[] = [
  {
    dimension: 'License',
    openrise: '100% MIT / Open',
    saas: 'Proprietary Lock-in',
    abandoned: 'Uncertain / Mixed',
    isPositive: true,
  },
  {
    dimension: 'Cost to Developers',
    openrise: 'Free Forever ($0)',
    saas: '$30–$300 / mo / seat',
    abandoned: 'Free (until broken)',
    isPositive: true,
  },
  {
    dimension: 'Active Mentorship',
    openrise: 'Structured & Direct',
    saas: 'None',
    abandoned: 'None',
    isPositive: true,
  },
  {
    dimension: 'Privacy & Telemetry',
    openrise: 'Zero Tracking',
    saas: 'Data Harvested',
    abandoned: 'Unverified',
    isPositive: true,
  },
  {
    dimension: 'Maintenance Continuity',
    openrise: 'Collective Governance',
    saas: 'Price Hikes / Sunsets',
    abandoned: 'Solo Dev Burnout',
    isPositive: true,
  },
];

export default function OpenSourceMatrix() {
  return (
    <div className="sing-table-wrap">
      <table className="sing-table">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[26%]" />
          <col className="w-[22%]" />
          <col className="w-[22%]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="sing-table-dim">
              Dimension
            </th>
            <th scope="col" className="sing-table-us">
              Openrise
            </th>
            <th scope="col">Commercial SaaS</th>
            <th scope="col">Solo Projects</th>
          </tr>
        </thead>
        <tbody>
          {MATRIX_ROWS.map((row, idx) => (
            <tr key={idx}>
              <th scope="row">{row.dimension}</th>
              <td className="sing-table-us">{row.openrise}</td>
              <td>{row.saas}</td>
              <td>{row.abandoned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
