<script setup>
const config = useRuntimeConfig()
console.log(config.public.maintenance)
</script>

<template>
  <Html>
    <Head>
      <title>Maintenance Mode</title>
      <meta name="description" content="The site is currently under maintenance. Please check back later." />
    </Head>

    <Body class="maintenance-body dark:bg-black dark:text-white">
      <div>
        <h1>Maintenance Mode</h1>
        <p>The site is currently under maintenance. Please check back later.</p>
      </div>

      <div class="spotlight" />
    </Body>
  </Html>
</template>

<style>
  .maintenance-body {
    font-family: Arial, sans-serif;
    line-height: 1.5;
    font-size: 16px;
    padding: 3.5rem 2.5rem 0 2.5rem;
    min-height: 100vh;
    color: #000;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .maintenance-body div {
    margin-top: 50px;
    text-align: center;
  }

  .maintenance-body h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
  }

  .maintenance-body p {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }

  .maintenance-body .spotlight {
    background: linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);
    bottom: -40vh;
    filter: blur(30vh);
    height: 60vh;
    opacity: .8;
    pointer-events: none;
    position: fixed;
    right: 0;
    left: 0;
  }
</style>
