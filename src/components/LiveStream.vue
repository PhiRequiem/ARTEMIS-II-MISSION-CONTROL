<template>
  <div class="panel">
    <div class="panel-title">
      <span class="relative flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
          style="box-shadow: 0 0 6px #ef4444, 0 0 12px rgba(239,68,68,0.5); animation: blink-active 1.2s ease-in-out infinite" />
        TRANSMISIÓN EN VIVO — NASA TV
      </span>
      <span class="ml-auto flex items-center gap-2">
        <span class="mono text-[9px] text-red-400 font-bold tracking-widest">● EN VIVO</span>
        <span class="mono text-[9px] text-slate-600">ARTEMIS II COVERAGE</span>
      </span>
    </div>
    <div class="relative w-full" style="padding-bottom: 56.25%">
      <iframe
        class="absolute inset-0 w-full h-full"
        :src="embedUrl"
        title="Artemis II Live Stream — NASA TV"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="border: none"
      />
    </div>
  </div>
</template>

<script setup>
const VIDEO_ID = 'm3kR2KK8TEs'
const embedUrl = `https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&color=white`
</script>
