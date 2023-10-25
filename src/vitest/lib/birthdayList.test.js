import { render } from '@testing-library/svelte';
import BirthdayList from '$lib/BirthdayList.svelte';


describe('BirthdayList.svelte component', () => {
  it('should display a list', () => {
    render(BirthdayList);

  });
});
