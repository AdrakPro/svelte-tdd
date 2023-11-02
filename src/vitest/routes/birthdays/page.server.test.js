import { load } from '$routes/birthdays/+page.server.js';


describe('/birthdays - load', () => {
  it('should return a fixture of two items', () => {
    const { birthdays } = load();
    expect(birthdays).toEqual([
      { name: 'Hercules', dob: '1994-02-02' },
      { name: 'Athena', dob: '1989-01-01' }
    ]);
  });
})
