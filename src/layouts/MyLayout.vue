<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Where to?
        </q-toolbar-title>

        <div>by Jyan</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
    export default {
        name: 'MyLayout',

        data() {
            return {
                leftDrawerOpen: false,
            };
        },
    };
</script>
