<template>
  <div class="h-screen flex flex-col">
    <Header />
    <div class="flex-1 mx-auto pt-12 pb-2 px-2 container overflow-hidden">
      <slot />
    </div>
    <ClientOnly>
      <PrinterStatusBar />
    </ClientOnly>
  </div>
</template>