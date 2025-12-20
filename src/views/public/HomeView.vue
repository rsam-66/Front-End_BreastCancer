<script setup>
// No script logic needed
</script>

<template>
  <div class="w-full">
    
    <section class="relative pt-20 pb-32 bg-blue-100 z-10">
      <div class="max-w-[1200px] mx-auto px-8 relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center">
        
        <div class="flex flex-col items-start z-10">
          <div class="inline-flex items-center gap-2 bg-[#0099ff] text-white px-5 py-2 rounded-full font-semibold mb-6 shadow-md">
            <span class="text-xl">🤖</span> Powered By AI
          </div>
          <h1 class="text-5xl font-extrabold text-slate-800 leading-tight mb-6">
            Early Detection of <br />
            Breast Cancer with <br />
            AI Technology
          </h1>
          <p class="text-slate-500 text-lg leading-relaxed mb-8 max-w-[90%]">
            An AI-based mammogram analysis system that helps doctors provide
            more accurate and faster diagnoses for breast cancer treatment.
          </p>
          <button class="bg-white text-[#0099ff] border-2 border-[#0099ff] px-10 py-3 rounded-lg font-bold text-lg hover:bg-[#0099ff] hover:text-white transition-colors duration-300">
            Start Now!
          </button>
        </div>

        <div class="mt-8 lg:mt-0 lg:absolute lg:top-16 lg:right-0 lg:w-[45%] z-20 pointer-events-none">
          <img 
            src="@/assets/images/doctor.png" 
            alt="Doctor" 
            class="w-full h-auto block" 
          />
        </div>
      </div>
    </section>

    <section id="features" class="relative py-24 bg-white z-0">
      <div class="max-w-[1200px] mx-auto px-8 lg:pr-[35%]">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-slate-800 mb-2">Key Features</h2>
          <p class="text-slate-500">Leading-edge technology for better diagnosis</p>
        </div>

        <div class="flex flex-wrap gap-8">
          <div class="bg-white border border-gray-100 rounded-xl p-8 w-full max-w-[320px] shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-2xl">
              <span>🧠</span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">AI Analysis</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              Automated mammogram image analysis using deep learning algorithms 
              with high accuracy for early breast cancer detection.
            </p>
          </div>

          <div class="bg-white border border-gray-100 rounded-xl p-8 w-full max-w-[320px] shadow-lg hover:-translate-y-1 transition-transform duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-2xl">
              <span>👨‍⚕️</span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Doctor Review</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              AI results are reviewed by specialist doctors to ensure an 
              accurate diagnosis and appropriate treatment.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="relative py-20 bg-gradient-to-b from-cyan-50 to-cyan-100 z-0">
      <div class="max-w-[1200px] mx-auto px-8 lg:pr-[35%]">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-slate-800 mb-2">How It Works</h2>
          <p class="text-slate-500">A simple process for an accurate diagnosis</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
          <div class="flex flex-col items-start">
            <div class="w-10 h-10 bg-[#0099ff] text-white rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-md">
              1
            </div>
            <h4 class="text-slate-800 font-semibold">Image Upload</h4>
          </div>
          <div class="flex flex-col items-start">
            <div class="w-10 h-10 bg-[#0099ff] text-white rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-md">
              2
            </div>
            <h4 class="text-slate-800 font-semibold">AI Analysis</h4>
          </div>
          <div class="flex flex-col items-start">
            <div class="w-10 h-10 bg-[#0099ff] text-white rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-md">
              3
            </div>
            <h4 class="text-slate-800 font-semibold">Doctor Review</h4>
          </div>
          <div class="flex flex-col items-start">
            <div class="w-10 h-10 bg-[#0099ff] text-white rounded-full flex items-center justify-center font-bold text-lg mb-2 shadow-md">
              4
            </div>
            <h4 class="text-slate-800 font-semibold">Treatment Plan</h4>
          </div>
        </div>
      </div>
    </section>

    <section id="why-us" class="relative py-20 bg-white z-30">
      <div class="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <h2 class="text-3xl font-bold text-slate-800 mb-8">Why Choose Us?</h2>
          <ul class="space-y-8">
            <li class="flex gap-4">
              <div class="min-w-[12px] h-3 w-3 bg-[#0099ff] rounded-full mt-2"></div>
              <div>
                <strong class="block text-lg text-slate-800 mb-1">More Accurate Early Detection</strong>
                <p class="text-slate-500 text-sm">AI helps detect signs of cancer that the human eye might miss.</p>
              </div>
            </li>
            <li class="flex gap-4">
              <div class="min-w-[12px] h-3 w-3 bg-[#0099ff] rounded-full mt-2"></div>
              <div>
                <strong class="block text-lg text-slate-800 mb-1">Faster Diagnosis</strong>
                <p class="text-slate-500 text-sm">Automated analysis saves time for faster treatment.</p>
              </div>
            </li>
            <li class="flex gap-4">
              <div class="min-w-[12px] h-3 w-3 bg-[#0099ff] rounded-full mt-2"></div>
              <div>
                <strong class="block text-lg text-slate-800 mb-1">Doctor & AI Collaboration</strong>
                <p class="text-slate-500 text-sm">Combining doctor expertise and AI intelligence for optimal results.</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex justify-center">
          <img 
            src="@/assets/images/lumira-logo-img.png" 
            alt="Lumira Logo" 
            class="w-4/5 h-auto object-contain" 
          />
        </div>
      </div>
    </section>

  </div>
</template>