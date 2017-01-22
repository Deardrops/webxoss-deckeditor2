<template>
  <div>
    <h1>Home</h1>
    <router-link to="/deck">Deck Editor</router-link>
    <router-link :to="{path: 'detail', query: { pid: '649'}}">
      Card Detail Page
    </router-link>
  </div>
</template>
