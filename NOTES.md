# SvelteKit TDD

## Chapter 2

Before starting a project `discussion at high level ` is needed (https://excalidraw.com). We need to learn enough to write a first failing test. 
(*What do we need next? What did we learn about our design?*)



`Triangulate test` against hard coded values. Double-check the same property with different values.

Use `queryBy` in the first test that introduces new element (can return null). Once test is green, subsequent tests can use `getBy`, which throws exception if the element isn't found. This make it clear that test depends on a previous test to prove the existence of the element.

Avoid writing unit tests for static information!



## Chapter 3


Playwright is driving a `headless browser`, starting a real browser process that runs in the background and is invisible to you.

- Has no mechanism for determining when the browser has completed working, waiting patiently and frequently checking the browser state
- Used to focusing a team on what needs to be built, don't need to cover all details. It's good starting point when building a new feature
- Start-ups the SvelteKit web server and executes all the SvelteKit runtime code for managing routes

Vitest loads js files directly into the same Node process. 

- Is used to work out `the how of a system`

- When unit test is difficult to write, that’s sometimes a sign that the application design is too complex
- Document all the technical design decisions taken when writing the code

- It's preferable to write one expectation per test



TDD can be used to delay design decisions that aren’t immediately relevant.



## Chapter 4

Sometimes we write a Red test and are ready to make it Green. But the approach to making it Green involves a lot of refactoring. In these scenarios, it is better to rewind by marking the new Red test as `skipped`. 
Then you can safely refactor while you are on Green. Once your refactor is complete, un-skip your test, and you’re back on *Red*. Now make the test pass given all your refactoring work is done. 
This approach guarantees safety of a fully Green test suite to tell whether your Refactor has been completed correctly or not.



Form role becomes available only if it has `name attribute`.

Selector `input[type=text]` checks the following: 
- Label element exists with the Name text
- Input element exists with the type attribute set to text
- Label is associated with the input element



## Chapter 5

The `when... context` style of naming describe is common when a group of tests belongs to a specific starting scenario. They often have a beforeEach setup. Avoid nesting when blocks.

Vitest and Playwright tests `are not independent`, so we need to clear the database before each test.

`beforeEach` can be considered as Arrange phase.



## Chapter 6

Editing previous tests is generally a bad idea. The reason for that is it can produce tests that end up specifying invalid scenarios that can never happen

If tests are a slog to write and update, that’s a sign that either the tests can be improved or the application code design can be improved.

There is no easy way to test hidden input field. One way is to add `id` field and access from `DOM` (document.forms.[...]).

`expect.objectContaining` means I don't care about anything expect these properties.



## Chapter 7

`Page object model` is a class that groups up the mechanical actions of navigating a page (locating a field, clicking a button, or filling in a text field) into methods that describe high-level operations that occur within your application

`Arrange-Act-Assert ` is a standard way to describe the order in which unit tests are written.

- Arrange phase, which is when the structure under test is primed for work. Any input data is constructed, and any preparatory methods are called that get the system into the right state

- Act phase, which invokes the operation that is being checked

- Assert phase, which can be one or more expectations that verify that the operation did what it was meant to

Each of these three phases benefits from different strategies to remove duplication.



`Factory methods` help generate supporting objects in the shortest amount of code possible. One way is to specify default values for object properties. Hiding necessary but irrelevant data is a key for keeping tests clear.



## Chapter 8

Matcher function will be defined using the standard `function keyword`. This means it gains access to the `this` bound variable.
The custom matcher requires its own set of unit tests and negated matchers are best to be avoided.

If your code contains any kind of `control structure or branching logic`, then it needs tests.

`beforeEach` runs for each test in the describe block, if you need setup code once use `beforeAll`.



## Chapter 9

Moving domain logic out of the framework into plain Javascript improves testability.

Module already exists but has no tests. And it’s often perfectly okay to leave these modules untested. The issue comes when we want to modify the behavior of these modules: where do we add the tests?
There is no clear answer. One way is to duplicate tests (and delete original tests) and add more.

This kind of forced repetition (where you feel the pain of repeated work) can help you to figure out what (if any) shared logic you’d like to pull out.

When porting tests, you’ll be writing tests that already pass. You skip the Red step and pass directly to Green. However, it’s still important to verify that your tests check the correct thing, and the way to do that is to delete or comment out the application code under test so that you can see the test fail.



## Chapter 10

Multiple expects can be used in e2e tests but for unit tests it's best to use only one.

When testing array objects, it’s always best to use two (and sometimes three) items in the list rather than just one. That way, it’s clear that the test is operating on lists of items, not just single items.

Be aware of expecting data in one test that has different lifecycle from others.

`expect.hasAssertions` ensures that test will fail if it does not raise an error.

```javascript
it('throws an error if the data is invalid', async () => {
  expect.hasAssertions();
  try {
    await POST({
      request: createRequest(
        createBirthday('Ares', '')
      )
    });
  } catch (error) {
    expect(error.status).toEqual(422);
    expect(error.body).toEqual({
      message:
        'Please provide a date of birth in the YYYY-MM-DD format.'
    });
  }
});
```





## Chapter 11

`Side-By-Side implementation`, which is a way to use tests to replace the existing code while ensuring the test suite remains on Green.
`Test dobule` takes the place of the framework code, avoiding a real network call out to the API.

`Test spy` is a function that keeps a record of each time it is called, together with the arguments it is called with. Later it can be inspected to verify that it was called with correct arguments. It acts as a substitute for a real function. It's almost always a `stub` as well, meaning it avoids calling the real function entirely, instead returning a hardcoded (stubbed) value.
When we use a test spy, at least one test that checks the arguments passed to the spy and at least one more test for each stubbed return value that the spy returns.



SvelteKit `fetch` is able to short-cut calls made on the server so that they don't cause an HTTP request but instead feed directly into the GET function that matches the route.



`mockResolvedValue` function is used to return a value wrapped in Promise by a spy.



## Chapter 12

The number-one rule when using component mocks, and test doubles in general, is to `avoid building any control logic` (if statements and loops) into them. Instead, when you use `mockReturnValue` or `mockResolvedValue` to specify the value that is returned, always prefer to return fixed values.

An easy way to ensure that happens is to ensure that each unit test gets its own test double instance. In other words, `avoid setting up a test double` in a beforeEach block and reusing it across all tests.

You don’t always need to use mocks. If you have a single test to prove the connection between Parent and Child, that’s often enough.

There is a general piece of advice to `avoid using data-testid` in tests. This is good advice, but your component stubs are a part of your test suite, not the application code, so it’s safe to use them here.

A big problem with mocking components: it’s `challenging to keep the mock aligned with real implementations`.

`Avoiding hand-rolled mocks` and using a library is one way to deal with this problem, as we’ll see in the next section.

When you begin test-driving **Parent**, you write a test that will bring in the **Child** component. Since you’ve already written the **Child** component at your disposal, then the simplest change is to simply bring in the **Child** component.

Then, the `rule of the Red test comes` into play, and this is the crucial one that avoids over testing. You can’t work on a test unless you see it fail. But if your first test brought in the **Child** component, you suddenly get all the behavior of **Child** for free. So, if you’re following TDD, it’s impossible to write a Red test for all the behavior of **Child**, because it will already pass.

Now imagine that you started by building the **Parent** component and at some point felt the urge to extract a **Child** component. How do you go about extracting **Child**? If you’re being strict, you might start by rewriting the tests for **Child**. But generally, you didn't stop there: you’d want to go back and delete those extra tests from **Parent**.



## Chapter 13

Cucumber tests are contained within `feature files` that contain tests formatted in a special syntax known as `Gherkin`. These tests, known as features and organized into scenarios, read like plain English. That has a couple of advantages.

- They can be written and understood by the whole team, not just developers. That means you can extend test-first practices outside the development team.
- The absence of code encourages you to write tests that focus on user behavior rather than the technical details of the software. That encourages you to build the right thing for your users.



## Chapter 15

When testing svelte stores write two tests. One is about of setting the initial value of store and second to ensure the store value is updated whenever the component prop changes



## Chapter 16

`Service workers`, which are bits of code that are installed on the browser and are invoked before any HTTP operation. It's almost always a good idea to use off-the-shelf service workers rather than rolling your own.

They relay on `self` that is proved bt the browser context. They need to attach listeners to certain events.
The trick to test the service worker is to move most of the functionality into another module: each event becomes a simple function call, and we can test that function call rather than the vent. Then, we leave the service worker module untested.
