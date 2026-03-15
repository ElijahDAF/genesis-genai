"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, ArrowRight, Calendar, Heart, Smile, BookOpen, Shield, MessageCircle, Sparkles, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

export function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <motion.div 
            className="grid gap-8 md:grid-cols-[1fr,320px] md:items-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div className="paper-card p-8 md:p-12 relative overflow-hidden" variants={fadeInUp}>
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <span className="sage-pill text-xs font-mono mb-4 inline-block relative">
                A GENTLE COMPANION FOR THOSE WHO CARED FOR US
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading md:text-4xl lg:text-5xl leading-tight relative">
                They spent a lifetime
                <span className="block text-primary">loving us.</span>
                <span className="block mt-2">Now it&apos;s our turn.</span>
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl">
                Everly is the daily check-in you wish you could make every morning. 
                A warm voice that asks how they slept, if they took their medicine, 
                and what memories drifted through their dreams.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  <Link href="/dashboard">
                    <Phone className="mr-2 h-5 w-5" />
                    Start Caring
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-[28px] border-border hover:bg-secondary transition-all" >
                  <Link href="/#how-it-works">
                    See how it works
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-10 pt-8 border-t border-border/50 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary font-heading">5 min</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">Daily check-ins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary font-heading">24/7</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">Always there</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary font-heading">100%</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">Family peace</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={fadeInUp}
            >
              <div className="paper-card overflow-hidden p-0 aspect-[4/5] max-h-[520px] bg-gradient-to-br from-secondary via-secondary/50 to-background flex items-center justify-center relative">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-primary/5" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative flex h-full w-full flex-col items-center justify-center text-center p-8">
                  <motion.span 
                    className="text-7xl mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🧚
                  </motion.span>
                  <span className="text-sm font-mono text-muted-foreground">Everly is listening</span>
                  
                  {/* Floating quote */}
                  <motion.div 
                    className="absolute bottom-8 left-4 right-4 paper-card p-4 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;Tell me about the time you met Grandma...&rdquo;
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem / Emotional Hook */}
      <section className="border-t border-border bg-secondary/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl lg:text-4xl">
              The phone call you meant to make.
              <span className="block text-primary mt-2">We make it for you.</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Life gets busy. Distance grows. And somewhere across town or across the country, 
              someone who once read you bedtime stories is eating dinner alone.
            </p>
            <p className="mt-4 text-muted-foreground">
              Everly bridges that gap — not to replace your love, but to extend it. 
              To be there when you can&apos;t be.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "The morning check-in",
                desc: "Did they sleep well? Are they in good spirits? A gentle start to their day."
              },
              {
                icon: Heart,
                title: "The health reminder",
                desc: "Soft prompts about medications, delivered with warmth, not urgency."
              },
              {
                icon: BookOpen,
                title: "The memory keeper",
                desc: "Stories from their youth, preserved forever before they fade."
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                className="paper-card p-6 text-center group hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground font-heading">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
              Setting up takes minutes.
              <span className="block text-muted-foreground font-normal text-lg mt-2">The peace of mind lasts forever.</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Share their story",
                desc: "Tell us about your loved one — their history, their medications, their favorite memories. This helps Everly speak their language.",
                cta: "Create Profile",
                href: "/create-elder"
              },
              {
                step: "2",
                title: "Add family contacts",
                desc: "Add yourself and other caregivers. We'll keep everyone updated after each call with insights and any concerns.",
                cta: "Add Caregiver",
                href: "/create-caregiver"
              },
              {
                step: "3",
                title: "The first hello",
                desc: "Start a call from your dashboard. Everly will introduce herself and begin building a relationship, one conversation at a time.",
                cta: "Open Dashboard",
                href: "/dashboard"
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="paper-card p-8 h-full flex flex-col">
                  <span className="sage-pill font-mono text-xs">{item.step}</span>
                  <h3 className="mt-4 font-semibold text-foreground font-heading text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">{item.desc}</p>
                  <Button asChild variant="outline" size="sm" className="mt-6 rounded-[28px] w-full">
                    <Link href={item.href}>{item.cta}</Link>
                  </Button>
                </div>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with emotion */}
      <section id="features" className="border-t border-border bg-secondary/20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
              More than technology.
              <span className="block text-primary mt-2">It&apos;s presence.</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Phone,
                title: "A familiar voice",
                desc: "Everly calls with the same warmth every day. No judgment, no rush — just someone who asks how they're doing and actually listens."
              },
              {
                icon: Heart,
                title: "Wellness that feels like care",
                desc: "Medication reminders woven naturally into conversation. Health check-ins that feel like friendship, not surveillance."
              },
              {
                icon: BookOpen,
                title: "Stories become legacies",
                desc: "Every memory shared is captured and saved. The time Grandpa met Elvis. Mom's wedding day jitters. A lifetime, preserved."
              },
              {
                icon: Calendar,
                title: "Never forgotten",
                desc: "Birthdays, anniversaries, the little routines that matter. Everly remembers what makes them feel seen."
              },
              {
                icon: MessageCircle,
                title: "Family in the loop",
                desc: "After each call, you get a gentle summary — mood, health notes, stories shared. You're always connected, even from afar."
              },
              {
                icon: Shield,
                title: "Dignity first",
                desc: "Privacy isn't a feature — it's our foundation. Their data belongs to your family, period."
              }
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                className="flex gap-4 rounded-[28px] border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-heading">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story/Testimonial Section */}
      <section className="py-16 md:py-24 bg-background overflow-hidden">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="paper-card p-8 md:p-10 bg-gradient-to-br from-primary/5 to-transparent">
                <Sparkles className="h-8 w-8 text-primary mb-6" />
                <blockquote className="text-xl md:text-2xl font-heading text-foreground italic leading-relaxed">
                  &ldquo;Everly called my mom every morning while I was overseas. 
                  When I came back, I had 47 pages of stories I'd never heard — 
                  about her childhood, her first job, how she and Dad fell in love. 
                  Things I never thought to ask.&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Daughter, Seattle</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
                We don&apos;t just check boxes.
                <span className="block text-primary mt-2">We check in.</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Every conversation is an opportunity to preserve a piece of someone&apos;s history. 
                The stories your parents never wrote down. The memories your grandparents 
                carry like precious cargo.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Before they fade. Before it&apos;s too late to ask. 
                Everly is there, capturing the essence of who they are — 
                so you&apos;ll always have it.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smile className="h-5 w-5 text-primary" />
                  <span>Mood tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Health insights</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Everly */}
      <section id="why-everly" className="border-t border-border bg-secondary/30 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
              Because love shouldn&apos;t have
              <span className="block text-primary mt-2">business hours.</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Companionship, delivered",
                desc: "Loneliness is a silent epidemic among seniors. Everly brings a friendly voice that remembers yesterday's conversation and asks about tomorrow's plans."
              },
              {
                icon: BookOpen,
                title: "Preserve their legacy",
                desc: "The stories they tell become a living memoir. Share with siblings, pass to grandchildren — a treasure of family history."
              },
              {
                icon: Heart,
                title: "Sleep better at night",
                desc: "Knowing someone checked in. Knowing they're okay. That small worry that lives in the back of your mind — gently quieted."
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                className="paper-card p-8 group hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <item.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground font-heading text-xl">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 md:py-28 bg-background overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground font-heading md:text-4xl lg:text-5xl">
              They were there for your first steps.
            </h2>
            <p className="mt-4 text-2xl md:text-3xl font-heading text-primary">
              Be there for their next chapter.
            </p>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto text-lg">
              Set up takes five minutes. The conversations will last a lifetime.
              Give your loved one the gift of being heard — and yourself the gift of peace.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 px-8">
                <Link href="/create-elder">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Free Today
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-[28px] px-8">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
            <p className="mt-8 text-xs text-muted-foreground font-mono">
              No credit card required. Set up in minutes. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer quote */}
      <section className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-muted-foreground font-mono">
            Made with care for families who believe that every story matters.
          </p>
        </div>
      </section>
    </main>
  )
}
