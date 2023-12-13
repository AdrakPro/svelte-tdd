import Page from '$routes/birthdays/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { click } from '@testing-library/user-event';
import { createBirthday } from '$factories/birthday.js';
import { birthdays as birthdaysStore } from '$stores/birthdays.js';

describe('/birthdays', () => {
  const birthdays = [
    createBirthday('Hercules', '1994-02-02', {
      id: '123'
    }),
    createBirthday('Athena', '1989-01-01', {
      id: '234'
    })
  ];

  it('should display a heading for "Add a new birthday"', () => {
    render(Page, { data: { birthdays } });
    expect(
      screen.queryByRole('heading', {
        name: 'Add a new birthday'
      })
    ).toBeVisible();
  });

  it('should display all the birthdays passed to it', () => {
    render(Page, { data: { birthdays } });
    expect(
      screen.queryByText('Hercules', {
        selector: 'li *'
      })
    ).toBeVisible();
    expect(
      screen.queryByText('Athena', {
        selector: 'li *'
      })
    ).toBeVisible();
  });

  it('should display a form for adding new birthday', () => {
    render(Page, { data: { birthdays } });
    expect(screen.queryByRole('form')).toBeVisible();
  });

  it('should pass any information to the BirthdayForm', () => {
    render(Page, {
      data: { birthdays },
      form: { error: 'An error' }
    });
    expect(screen.queryByText('An error')).toBeVisible();
  });

  it('should display an Edit button for each birthday in the list', () => {
    render(Page, { data: { birthdays } });
    expect(
      screen.queryAllByRole('button', { name: 'Edit' })
    ).toHaveLength(2);
  });

  it('should save the loaded birthdays into the birthdays store', () => {
    let storedBirthdays;
    birthdaysStore.subscribe(
      (value) => (storedBirthdays = value)
    );
    render(Page, { data: { birthdays } });
    expect(storedBirthdays).toEqual(birthdays);
  });

  it('should update the birthdays store when the component props change', async () => {
    let storedBirthdays;
    birthdaysStore.subscribe(
      (value) => (storedBirthdays = value)
    );
    const { component } = render(Page, {
      data: { birthdays }
    });
    await component.$set({ data: { birthdays: [] } });
    expect(storedBirthdays).toEqual([]);
  });

  describe('when editing an existing birthday', () => {
    beforeEach(() => render(Page, { data: { birthdays } }));
    const firstEditButton = () =>
      screen.queryAllByRole('button', {
        name: 'Edit'
      })[0];

    it('should hide the existing birthday information', async () => {
      await click(firstEditButton());
      expect(screen.queryByText('Hercules')).toBeNull();
    });

    it('should hide the birthday form for adding new birthdays', async () => {
      await click(firstEditButton());
      expect(
        screen.queryByRole('heading', {
          name: 'Add a new birthday'
        })
      ).toBeNull();
    });

    it('should display the birthday form for editing', async () => {
      await click(firstEditButton());
      expect(screen.getByLabelText('Name')).toHaveValue(
        'Hercules'
      );
    });

    it('should hide all the Edit buttons', async () => {
      await click(firstEditButton());
      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).toBeNull();
    });
  });

  it('should open the form in editing mode if a form id is passed in', () => {
    render(Page, {
      data: {
        birthdays: [
          createBirthday('Hercules', '1994-02-02', {
            id: '123'
          })
        ]
      },
      form: {
        ...createBirthday('Hercules', 'bad dob', {
          id: '123'
        }),
        error: 'An error'
      }
    });
    expect(
      screen.queryByRole('heading', {
        name: 'Add a new birthday'
      })
    ).toBeNull();
  });
});
