<script>
  export let form;
</script>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}
<form action="" name="birthday" method="post">
  <label>
    Name
    <input
      type="text"
      name="name"
      value={form?.name || ''}
    />
  </label>
  <label>
    Date of birth
    <input type="text" name="dob" value={form?.dob || ''} />
  </label>
  {#if form?.id}
    <input type="hidden" name="id" value={form.id} />
  {/if}
  <input type="submit" value="Save" />
</form>

<style>
  .error {
    color: red;
  }
</style>
