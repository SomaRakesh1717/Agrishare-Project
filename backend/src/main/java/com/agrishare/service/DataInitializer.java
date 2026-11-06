package com.agrishare.service;

import com.agrishare.model.*;
import com.agrishare.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

        private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

        private final UserRepository userRepository;
        private final MachineryRepository machineryRepository;
        private final SeedRepository seedRepository;
        private final LabourRepository labourRepository;
        private final OperatorRepository operatorRepository;
        private final BookingRepository bookingRepository;
        private final ChatMessageRepository chatMessageRepository;
        private final PasswordEncoder passwordEncoder;

        public DataInitializer(UserRepository userRepository,
                        MachineryRepository machineryRepository,
                        SeedRepository seedRepository,
                        LabourRepository labourRepository,
                        OperatorRepository operatorRepository,
                        BookingRepository bookingRepository,
                        ChatMessageRepository chatMessageRepository,
                        PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.machineryRepository = machineryRepository;
                this.seedRepository = seedRepository;
                this.labourRepository = labourRepository;
                this.operatorRepository = operatorRepository;
                this.bookingRepository = bookingRepository;
                this.chatMessageRepository = chatMessageRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) {
                initUsers();
                initMachinery();
                initSeeds();
                initLabour();
                initOperators();
                cleanupDemoData();
        }

        private void initUsers() {
                // Ensure Admin exists
                User admin = userRepository.findByEmail("admin@agrishare.com").orElse(null);
                if (admin == null) {
                        admin = new User(
                                        "AgriShare Admin",
                                        "admin@agrishare.com",
                                        passwordEncoder.encode("Admin@123"),
                                        Role.ROLE_ADMIN,
                                        "+91 98480 99999",
                                        "AgriShare Central Depot, Nizamabad, Telangana",
                                        18.6725, 78.0941,
                                        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200");
                        userRepository.save(admin);
                        logger.info("Admin user created: admin@agrishare.com");
                } else {
                        admin.setName("AgriShare Admin");
                        userRepository.save(admin);
                }

                // Remove old demo users (Farmer A & Farmer B)
                userRepository.findByEmail("farmer.a@agrishare.com").ifPresent(fa -> {
                        userRepository.delete(fa);
                        logger.info("Removed legacy demo user: farmer.a@agrishare.com");
                });
                userRepository.findByEmail("farmer.b@agrishare.com").ifPresent(fb -> {
                        userRepository.delete(fb);
                        logger.info("Removed legacy demo user: farmer.b@agrishare.com");
                });
        }

        private void cleanupDemoData() {
                // Delete sample booking and demo chats if present
                try {
                        bookingRepository.findAll().stream()
                                        .filter(b -> "AGR-8821".equals(b.getBookingNumber()) ||
                                                        "farmer.a@agrishare.com"
                                                                        .equalsIgnoreCase(b.getBookedByUserEmail())
                                                        ||
                                                        "farmer.b@agrishare.com"
                                                                        .equalsIgnoreCase(b.getOwnerOrProviderPhone()))
                                        .forEach(bookingRepository::delete);

                        chatMessageRepository.findAll().stream()
                                        .filter(c -> (c.getContent() != null && c.getContent().contains("Suresh garu"))
                                                        ||
                                                        (c.getContent() != null
                                                                        && c.getContent().contains("Ramesh garu")))
                                        .forEach(chatMessageRepository::delete);
                } catch (Exception ex) {
                        logger.warn("Cleanup notice: {}", ex.getMessage());
                }
        }

        	private void initMachinery() {
		User admin = userRepository.findByEmail("admin@agrishare.com").orElse(null);
		String ownerId = admin != null ? admin.getId() : "admin_id";
		String ownerName = admin != null ? admin.getName() : "AgriShare Admin";
		String ownerPhone = admin != null ? admin.getPhone() : "+91 98480 99999";

		if (machineryRepository.count() > 0) {
			return;
		}

		logger.info("Initializing 13 verified agricultural machinery items from Stitch design...");

		List<Machinery> items = List.of(
				createMachinery("John Deere 5310 4WD", "Tractors",
						"55 HP Heavy Duty Tractor • 4WD Utility",
						55, "Diesel", "Hydraulic Trolley hook", 6500.0, 850.0,
						"Nizamabad Central, Telangana", "Nizamabad", "Telangana", 18.675, 78.1,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuB15P_70TIaXjHUnSrSCTlyLn7A5ZL1xD_WPbLXawrSTrTzoaHuf91DmmBu3xX3BiGxFcxbbvOIWBIEXcz5Bb2sWX0VqO7uY-E-Ln4QyWD7D0SMBiPWEIDI8B5mU3VZIO5bfzqMIWXorAwUzl56nM1xPZPPtX8G3_7hP-943uSR-NbRWUq14RD8tii_TqiIEEB3ibAZBsI0sL1t6DThm4FT4jg3GjIRqVzHSYSYouw1X-8IkETK7c0y"),
						true, 4.9, 56),
				createMachinery("Kubota DC-68G Harvester", "Harvesters",
						"High-efficiency Paddy &amp; Grain Combine",
						50, "Diesel", "Grain Bagging kit", 18500.0, 2100.0,
						"Warangal Hwy, Telangana", "Nizamabad", "Telangana", 18.685000000000002, 78.115,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuB4Qb9VTjg4HlpwcuB0ZnbmnqbTw3F2hCq5BwVNqcxL9GZhxAwQ5BgXX_GZ-MUN8iI3-G9Evd2rktrftpnJfYRuBPPHhSNrvNNY8fQYE9XW-qD8EZ1pH7dKa3pazJPJKhKPxTLxJojnbWlxmxtvkMo2pLuBrecIPbvahndo1NPFWgGZ-wFrMSmzTk-WX0XOPFutcf4D8tuU5tbCkPeXIXAj_C4N31803be4hoddW7ctk0Q9uahgxdhf"),
						true, 4.8, 34),
				createMachinery("Mahindra Arjun 605 DI", "Tractors",
						"60 HP Engine with 42-blade Rotavator",
						60, "Diesel", "Dual Clutch", 7200.0, 920.0,
						"Armoor Mandal, Telangana", "Nizamabad", "Telangana", 18.695, 78.13,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuBvNc3HlYPFJVahgYbWBlYkmYelRma4n6mBTmYlD49rSRMQ_b6AOBpwjZpvEwpJCNCcauaRCmscI-K-F9pKbhqbYuzqhxpA2aTAs6NVbeeKofhDvfbY53LkE7QOPFefTfKMQkg1OzOSkYrspafnd-FkPUtbKH2N70gXHdsX9B64yqXmZcyqET5xQ51ueGaerKZ-21nQGKLr7t9V9xsnQ9tnJcCvHNI-8zcK6Bh9UzgGPjw_iXdMaG-A"),
						true, 4.7, 28),
				createMachinery("Sonalika Tiger DI 50", "Tractors",
						"52 HP High Torque Utility Tractor",
						52, "Diesel", "Direct Injection", 6000.0, 780.0,
						"Bodhan, Telangana", "Nizamabad", "Telangana", 18.705000000000002, 78.145,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuAnD6QTR4a-70QjeHKKPB8HH_KTmsdzn6tW3ylKOQ5UlEZivjjTtBSzMlzZ-yDTt-3eG5IUiKcDBxXLllBKDRdXv_larSS445YXuYHpqhTyKHI60s29XQQNTDpOH0HQ2g_TtUT8PsWwz_5tZTMXbJhc_zZJZHZDHsucJotj8UAbg3_3NAjy0UlY4jsNf0LITTfrrPp-GtQrgVKMkGEEx7Kg5Ui4oCLFbKQAhw6JkKWuSi041EmcT9D_"),
						true, 4.9, 41),
				createMachinery("Shaktiman Rotary Tiller 7ft", "Rotavators",
						"Heavy Duty Soil Preparation Implement",
						60, "Diesel", "Fits 45-60 HP PTO", 3400.0, 450.0,
						"Nizamabad North, Telangana", "Nizamabad", "Telangana", 18.715, 78.16,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuAjZsC299a-iZHV3cMEgfV_L4bjfWpQpyJmrVrZW0jWSQ46chcr1MIJhv0a9tG_qtZPd16CmqHTO8sUV41tbhyaEIH222zMPWyZLElbYFJs21If_aIHyiVDotSN7CfWCGhij10-Pf3gL9a_DmpHfGq0eZTxVk94ctEKB-UZPxq1m9gBO_bsOb8dFgbaOIWyOku1QmgPfWMZe5oP66_4hyIEYOzN35L5-6XX1rIHsZ4b7zm5GICEWXP1"),
						true, 4.6, 19),
				createMachinery("ASPEE HTP High-Pressure Sprayer", "Sprayers",
						"Tractor-Mounted 600-Litre Boom Unit",
						50, "Diesel", "Ceramic Nozzles", 2800.0, 380.0,
						"Dichpally, Telangana", "Nizamabad", "Telangana", 18.725, 78.175,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuBTrpcjJEaKadPEifPITR3WH5LDtRHcdeqZvWNsNKmblZ85PvuCsR16EJLi9f5mliKNqLjlszPK5e-Ohu7vkwyf55LZEkHvMYK_CzN2qOQ4YKaEGBTbwFwEppcPF8XONkzpfgs0oiNGpuYcxOgxGffasWP0tOMWJ-v3VdGgN3t1VaetBPXZu3FYa3X8qXqoleCKULhfl6gWbKoFBV3rmxkt8Kdsfo_HQl7x-JhJ5Hz0Pr-ss5SKGeMj"),
						true, 4.8, 22),
				createMachinery("Lemken Opal 090 Reversible Plough", "Ploughs",
						"Hydraulic Reversible 2-Furrow Mouldboard Plough",
						50, "Diesel", "Boron Steel Shares", 2500.0, 340.0,
						"Banswada, Telangana", "Nizamabad", "Telangana", 18.735, 78.19,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuAjZsC299a-iZHV3cMEgfV_L4bjfWpQpyJmrVrZW0jWSQ46chcr1MIJhv0a9tG_qtZPd16CmqHTO8sUV41tbhyaEIH222zMPWyZLElbYFJs21If_aIHyiVDotSN7CfWCGhij10-Pf3gL9a_DmpHfGq0eZTxVk94ctEKB-UZPxq1m9gBO_bsOb8dFgbaOIWyOku1QmgPfWMZe5oP66_4hyIEYOzN35L5-6XX1rIHsZ4b7zm5GICEWXP1"),
						true, 4.7, 15),
				createMachinery("Dasmesh 912 Combine Harvester", "Harvesters",
						"Multi-Crop Self-Propelled Combine with Straw Chopper",
						101, "Diesel", "Paddy / Maize Ready", 21000.0, 2400.0,
						"Kamareddy Road, Telangana", "Nizamabad", "Telangana", 18.745, 78.205,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuB4Qb9VTjg4HlpwcuB0ZnbmnqbTw3F2hCq5BwVNqcxL9GZhxAwQ5BgXX_GZ-MUN8iI3-G9Evd2rktrftpnJfYRuBPPHhSNrvNNY8fQYE9XW-qD8EZ1pH7dKa3pazJPJKhKPxTLxJojnbWlxmxtvkMo2pLuBrecIPbvahndo1NPFWgGZ-wFrMSmzTk-WX0XOPFutcf4D8tuU5tbCkPeXIXAj_C4N31803be4hoddW7ctk0Q9uahgxdhf"),
						true, 4.9, 48),
				createMachinery("Kirloskar 7.5HP Diesel Water Pump", "Water pumps",
						"High-Discharge Centrifugal Irrigation Engine",
						5, "Diesel", "100mm Delivery Hose", 1700.0, 220.0,
						"Varni Mandal, Telangana", "Nizamabad", "Telangana", 18.755, 78.22,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuAjZsC299a-iZHV3cMEgfV_L4bjfWpQpyJmrVrZW0jWSQ46chcr1MIJhv0a9tG_qtZPd16CmqHTO8sUV41tbhyaEIH222zMPWyZLElbYFJs21If_aIHyiVDotSN7CfWCGhij10-Pf3gL9a_DmpHfGq0eZTxVk94ctEKB-UZPxq1m9gBO_bsOb8dFgbaOIWyOku1QmgPfWMZe5oP66_4hyIEYOzN35L5-6XX1rIHsZ4b7zm5GICEWXP1"),
						true, 4.8, 37),
				createMachinery("Fieldking Disc Harrow Cultivator", "Cultivators",
						"Mounted Heavy-Duty Offset 16-Disc Harrow",
						50, "Diesel", "High Carbon Steel Discs", 2900.0, 390.0,
						"Mupkal, Telangana", "Nizamabad", "Telangana", 18.765, 78.235,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuBTrpcjJEaKadPEifPITR3WH5LDtRHcdeqZvWNsNKmblZ85PvuCsR16EJLi9f5mliKNqLjlszPK5e-Ohu7vkwyf55LZEkHvMYK_CzN2qOQ4YKaEGBTbwFwEppcPF8XONkzpfgs0oiNGpuYcxOgxGffasWP0tOMWJ-v3VdGgN3t1VaetBPXZu3FYa3X8qXqoleCKULhfl6gWbKoFBV3rmxkt8Kdsfo_HQl7x-JhJ5Hz0Pr-ss5SKGeMj"),
						true, 4.7, 24),
				createMachinery("Landforce Automatic Pneumatic Seeder", "Seeders",
						"Zero Till Precision Multi-Crop Seed Cum Fertilizer Drill",
						50, "Diesel", "Dual Hopper Unit", 4000.0, 520.0,
						"Bheemgal, Telangana", "Nizamabad", "Telangana", 18.775000000000002, 78.25,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuBTrpcjJEaKadPEifPITR3WH5LDtRHcdeqZvWNsNKmblZ85PvuCsR16EJLi9f5mliKNqLjlszPK5e-Ohu7vkwyf55LZEkHvMYK_CzN2qOQ4YKaEGBTbwFwEppcPF8XONkzpfgs0oiNGpuYcxOgxGffasWP0tOMWJ-v3VdGgN3t1VaetBPXZu3FYa3X8qXqoleCKULhfl6gWbKoFBV3rmxkt8Kdsfo_HQl7x-JhJ5Hz0Pr-ss5SKGeMj"),
						true, 4.9, 29),
				createMachinery("Mahindra Heavy Duty Tractor Tipping Trailer", "Tractor trailers",
						"Hydraulic 2-Wheel Heavy Duty 5-Tonne Grain Cart",
						50, "Diesel", "Telescopic Jack", 2200.0, 300.0,
						"Navipet, Telangana", "Nizamabad", "Telangana", 18.785, 78.265,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuAnD6QTR4a-70QjeHKKPB8HH_KTmsdzn6tW3ylKOQ5UlEZivjjTtBSzMlzZ-yDTt-3eG5IUiKcDBxXLllBKDRdXv_larSS445YXuYHpqhTyKHI60s29XQQNTDpOH0HQ2g_TtUT8PsWwz_5tZTMXbJhc_zZJZHZDHsucJotj8UAbg3_3NAjy0UlY4jsNf0LITTfrrPp-GtQrgVKMkGEEx7Kg5Ui4oCLFbKQAhw6JkKWuSi041EmcT9D_"),
						true, 4.8, 33),
				createMachinery("Redland Multi-Crop Power Thresher", "Threshers",
						"Tractor PTO Driven High Output Paddy/Soybean Thresher",
						35, "Diesel", "High Speed Blower", 3600.0, 480.0,
						"Balkonda, Telangana", "Nizamabad", "Telangana", 18.795, 78.28,
						ownerId, ownerName, ownerPhone,
						List.of("https://lh3.googleusercontent.com/aida-public/AB6AXuAjZsC299a-iZHV3cMEgfV_L4bjfWpQpyJmrVrZW0jWSQ46chcr1MIJhv0a9tG_qtZPd16CmqHTO8sUV41tbhyaEIH222zMPWyZLElbYFJs21If_aIHyiVDotSN7CfWCGhij10-Pf3gL9a_DmpHfGq0eZTxVk94ctEKB-UZPxq1m9gBO_bsOb8dFgbaOIWyOku1QmgPfWMZe5oP66_4hyIEYOzN35L5-6XX1rIHsZ4b7zm5GICEWXP1"),
						true, 4.6, 21)
		);

		machineryRepository.saveAll(items);
	}

	private void initSeeds() {
		User admin = userRepository.findByEmail("admin@agrishare.com").orElse(null);
		String sellerId = admin != null ? admin.getId() : "admin_id";
		String sellerName = admin != null ? admin.getName() : "AgriShare Admin";
		String sellerPhone = admin != null ? admin.getPhone() : "+91 98480 99999";

		if (seedRepository.count() > 0) {
			return;
		}

		logger.info("Initializing 12 certified crop seed varieties from Stitch design...");

		List<Seed> seeds = List.of(
				createSeed("Arka Rakshak F1 Hybrid Tomato Seeds", "Tomato", "Arka",
						"High Yield &amp; Field Tested. Triple disease resistance (ToLCV + BW + EB) with exceptional fruit firmness.",
						650.0, 1000.0, 92.0, 115, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuC3B9zFs5-qMk-XrS8cqylUSG-oIQLFYgVsBjyoJiqfWdw3Q39F0KTVpMMJqw5_vl0Oh63mBXADUJhyp8I7H67b9vypk90XZdBaiu9xt7JFWrx1ooBT5l43QFZS0rRn1KjKwSzk68_Ag6oLYnUAtOsgY2pIoci9yitA8uBHERfgC_Dm-CoQ22eymYaa2NgrggG5swtwX9IDyKW9RVGvjsAY59y9eiPZg0RncE5dUekJ2wf0Q42J2_8j",
						true, 4.9, 30),
				createSeed("Telangana Sona (RNR 15048) Paddy", "Rice", "Telangana",
						"Super fine grain with lowest Glycemic Index (51.5). Blast resistant with outstanding milling recovery.",
						1450.0, 1250.0, 93.0, 120, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuC7FRiIFeyiMaol02JRqMbXvcMbhlX7jxdXDT8E6NvL7-EdmBGboFG8dtCMPMc2IAUg-wwceCXw-P24xw5NWaJaWBRhf2A41PLWYIDRbhg2PgW3CCZERBAT52hdwoO5yu5Lbiwh46TS0MjdsgejMvg7wlhlppQEShphLfzzs_Xh37gA6fFqQcj0nIhX2fzpD-OW2fNmR4PqCjZqdftiMMeFTwkFydjK5xKy3dwpQ-_i-xPhwNRNp_T6",
						true, 4.9, 33),
				createSeed("Kaveri 244 Hybrid Maize", "Maize", "Kaveri",
						"Sturdy thick stalk with high wind tolerance and uniform cob placement. Yields 35-42 quintals/acre.",
						980.0, 1500.0, 94.0, 125, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDfLBz0tk_zQVBM3Pcc62ZBMnznUTnP-ZRQfZjvfJzMrZQ9LiQwaoDXp7ApfmX3uvHVZtJBgNQFT_xx1-egr6bjC0wwKMYUINB9PDV1n4SDwSgQ2hk4zi6Ql_r8LFKbewt31ajbaxuSWwWrAHFeSyjPPDfsp734VJqR_lYyHARNiIVp65cHUhTB_OuaXS_fXr8dP2w_jP7ShfJHbK4jOjuXLDer9sBKmN72ujHnUft6xlztHRv1PJDh",
						true, 4.9, 36),
				createSeed("PUSA Bold Mustard / Oilseeds", "Mustard", "PUSA",
						"Widely adapted bold seeded variety with heavy pod formation and exceptional frost/aphid tolerance.",
						340.0, 1750.0, 95.0, 130, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuBQfbLMLVUzwHLM95Brta1mIrwEh8pf4N9-iIQx3qI5YrPGt0AHt1nXkRHdHCYX12g5gzGpvrVMJdmDk1qKVNq6SE5vs99bFVTUhtEBZZYSoNR8AqonJQZCVr-VIKIzcu0l3GGXEgrfNAWPjYwI1bNeQu4y3Kara_UFyF1fuCu8ZZgmHP4j5oifEDlnfRH65cjHCyHRgpMmafgO5KMa7ENTLrwJ-iYTwV2sxszorrPiggKpuQreBXfJ",
						true, 4.9, 39),
				createSeed("US 7067 Bt-Cotton Seeds", "Cotton", "US",
						"BG II Bollworm Defense. High boll retention, easy picking and uniform staple length under rainfed soils.",
						860.0, 2000.0, 96.0, 135, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDft698lrOW7k2cCVSFuNkD4QxdGbnpIXsvaeB_ZEvMGgYue7UwgO5jctgSEgU4Ex2Yr2HAL1eG4YmHjgOuf3KXfvhMcZKPpDu1D0kAgfnQFxi56JG1Fy3kOz_S9kgd36NogY5yqdLJDOrGKxCZmiMg_Lg5eOhGAeimwR3XC5IRrj3pZratDctSk-EbXl8eb6ZeZQlzdLWp9gSrQjEmAU-Bmsh87pfLiADgu68gNDegfLz25aQDmnPs",
						true, 4.9, 42),
				createSeed("HD-2967 High Yield Wheat", "Wheat", "HD-2967",
						"Certified breeder foundation wheat with exceptional resistance against yellow &amp; brown rust. 50-55 q/ha yield.",
						1200.0, 2250.0, 97.0, 140, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuC7FRiIFeyiMaol02JRqMbXvcMbhlX7jxdXDT8E6NvL7-EdmBGboFG8dtCMPMc2IAUg-wwceCXw-P24xw5NWaJaWBRhf2A41PLWYIDRbhg2PgW3CCZERBAT52hdwoO5yu5Lbiwh46TS0MjdsgejMvg7wlhlppQEShphLfzzs_Xh37gA6fFqQcj0nIhX2fzpD-OW2fNmR4PqCjZqdftiMMeFTwkFydjK5xKy3dwpQ-_i-xPhwNRNp_T6",
						true, 4.9, 45),
				createSeed("GCH-7 Hybrid Groundnut", "Groundnut", "GCH-7",
						"High shelling percentage (72%), rich oil content (51%) and strong tolerance against collar rot &amp; tikka disease.",
						1650.0, 2500.0, 98.0, 145, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuBQfbLMLVUzwHLM95Brta1mIrwEh8pf4N9-iIQx3qI5YrPGt0AHt1nXkRHdHCYX12g5gzGpvrVMJdmDk1qKVNq6SE5vs99bFVTUhtEBZZYSoNR8AqonJQZCVr-VIKIzcu0l3GGXEgrfNAWPjYwI1bNeQu4y3Kara_UFyF1fuCu8ZZgmHP4j5oifEDlnfRH65cjHCyHRgpMmafgO5KMa7ENTLrwJ-iYTwV2sxszorrPiggKpuQreBXfJ",
						true, 4.9, 48),
				createSeed("JS 335 Certified Soybean", "Soybean", "JS",
						"Premier non-shattering pods with 40% protein and 20% oil content. 95-100 days maturity with uniform harvest.",
						1850.0, 2750.0, 92.0, 95, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDfLBz0tk_zQVBM3Pcc62ZBMnznUTnP-ZRQfZjvfJzMrZQ9LiQwaoDXp7ApfmX3uvHVZtJBgNQFT_xx1-egr6bjC0wwKMYUINB9PDV1n4SDwSgQ2hk4zi6Ql_r8LFKbewt31ajbaxuSWwWrAHFeSyjPPDfsp734VJqR_lYyHARNiIVp65cHUhTB_OuaXS_fXr8dP2w_jP7ShfJHbK4jOjuXLDer9sBKmN72ujHnUft6xlztHRv1PJDh",
						true, 4.9, 51),
				createSeed("Guntur Teja S17 Chilli Hybrid", "Chilli", "Guntur",
						"Intense dark red pods with 75,000+ SHU pungency. Prolific branching with virus tolerance for heavy commercial yields.",
						780.0, 3000.0, 93.0, 155, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuC3B9zFs5-qMk-XrS8cqylUSG-oIQLFYgVsBjyoJiqfWdw3Q39F0KTVpMMJqw5_vl0Oh63mBXADUJhyp8I7H67b9vypk90XZdBaiu9xt7JFWrx1ooBT5l43QFZS0rRn1KjKwSzk68_Ag6oLYnUAtOsgY2pIoci9yitA8uBHERfgC_Dm-CoQ22eymYaa2NgrggG5swtwX9IDyKW9RVGvjsAY59y9eiPZg0RncE5dUekJ2wf0Q42J2_8j",
						true, 4.9, 54),
				createSeed("Pusa Sawani Okra / Bhindi", "Vegetable", "Pusa",
						"Dark green, 5-ridged tender spineless pods. Outstanding heat tolerance for continuous multi-flush harvesting.",
						420.0, 3250.0, 94.0, 160, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDc-IZAQ8NF_BUoh_DTDEtO2xXDtIi0fTD2_wxyLl2RoWqu7mJFPGMOENm1fSeGDST1PSad9kqgBcsQqiEG-1YxnYzWGUf2CYud0NtwcvfUr5L1PswKoRqQbzvl1igjCCy4XYWPNI2znUxI-c1Te9VHxRpamFyNus2qBkbnBXBnae1H5GShGhFZtENyCdtExcEvCJ42sYmApLSNRzBbF1zwYyr2hRca-AvL78KLn8Y4teWHdBOyWsz6",
						true, 4.9, 57),
				createSeed("PDM-139 Samrat Green Gram", "Pulses", "PDM-139",
						"Short duration extra-early synchronous maturity variety. Tolerant to MYMV and ideal for crop rotation.",
						1150.0, 3500.0, 95.0, 165, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuBQfbLMLVUzwHLM95Brta1mIrwEh8pf4N9-iIQx3qI5YrPGt0AHt1nXkRHdHCYX12g5gzGpvrVMJdmDk1qKVNq6SE5vs99bFVTUhtEBZZYSoNR8AqonJQZCVr-VIKIzcu0l3GGXEgrfNAWPjYwI1bNeQu4y3Kara_UFyF1fuCu8ZZgmHP4j5oifEDlnfRH65cjHCyHRgpMmafgO5KMa7ENTLrwJ-iYTwV2sxszorrPiggKpuQreBXfJ",
						true, 4.9, 60),
				createSeed("Rhizo-Phos Bio Seed Treatment", "Bio-inputs", "Rhizo-Phos",
						"Dual-strain liquid inoculant (Rhizobium + PSB). Enhances seed germination speed by 18% and fixes soil nitrogen.",
						280.0, 3750.0, 96.0, 170, "1 kg",
						"AgriShare Central Seed Depot, Nizamabad", "Nizamabad", "Telangana", 18.6725, 78.0941,
						sellerId, sellerName, sellerPhone,
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDc-IZAQ8NF_BUoh_DTDEtO2xXDtIi0fTD2_wxyLl2RoWqu7mJFPGMOENm1fSeGDST1PSad9kqgBcsQqiEG-1YxnYzWGUf2CYud0NtwcvfUr5L1PswKoRqQbzvl1igjCCy4XYWPNI2znUxI-c1Te9VHxRpamFyNus2qBkbnBXBnae1H5GShGhFZtENyCdtExcEvCJ42sYmApLSNRzBbF1zwYyr2hRca-AvL78KLn8Y4teWHdBOyWsz6",
						true, 4.9, 63)
		);

		seedRepository.saveAll(seeds);
	}

	private void initLabour() {
		if (labourRepository.count() > 0) {
			return;
		}

		logger.info("Initializing 6 verified skilled farm labour crews from Stitch design...");

		List<Labour> crews = List.of(
				createLabour("Mallamma & Harvest Team (5 Pax)",
						List.of("Paddy Transplant", "Manual Harvesting", "Bundling", "Weeding"),
						2500.0, 12, 5, "Female",
						"Women Harvest & Paddy Transplant Team. Fast and diligent transplanting and harvest crew with zero crop wastage record.",
						"4.5 km away • Armoor", "Armoor", "Telangana", 18.7885, 78.289,
						"+91 94401 54312",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuBaWtx0LXnvtyDcEUDwPKVOyoMFtuft-eTmXcjgbamUUvOAmh27SXlbk1kOpi1XtjJIsd6BKCNy9crq8r0p4tN-3KKEqJXjVgvQR3AATdRFgexx0clfy-to6Of2O_-pFoNT3bos5Q858wNmrRfVHdKG8GpuXnvsm_ZIkhuIsTdNITH5nJbhX0u18XI1itJIMVb1ntnkKzH3y5TMSGoqB5GPa82cpRXzP9CaCKEE0e6XB57SQq_9q9_1", true,
						5.0, 118),
				createLabour("Laxmi Bai & Cotton Picking Group (4 Pax)",
						List.of("Cotton Picking", "Weeding", "Sorting", "Chilli Grading"),
						1800.0, 9, 4, "Female",
						"Manual Weeding & Cotton Picking Crew. Clean boll harvests without leaf trash; gentle grading of fresh produce.",
						"3.8 km away • Dichpally", "Kamareddy", "Telangana", 18.32, 78.34,
						"+91 94401 66291",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuBaWtx0LXnvtyDcEUDwPKVOyoMFtuft-eTmXcjgbamUUvOAmh27SXlbk1kOpi1XtjJIsd6BKCNy9crq8r0p4tN-3KKEqJXjVgvQR3AATdRFgexx0clfy-to6Of2O_-pFoNT3bos5Q858wNmrRfVHdKG8GpuXnvsm_ZIkhuIsTdNITH5nJbhX0u18XI1itJIMVb1ntnkKzH3y5TMSGoqB5GPa82cpRXzP9CaCKEE0e6XB57SQq_9q9_1", true,
						4.8, 76),
				createLabour("Pochamma Chilli Harvest Squad (6 Pax)",
						List.of("Chilli Harvest", "Groundnut Digging", "Grading", "Field Clearing"),
						2800.0, 11, 6, "Mixed Crew",
						"Chilli & Groundnut Harvest Crew. Rapid selective picking of green and dry chillies without damage to plant nodes.",
						"7.3 km away • Kotgiri", "Bodhan", "Telangana", 18.665, 77.89,
						"+91 94401 88472",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuBaWtx0LXnvtyDcEUDwPKVOyoMFtuft-eTmXcjgbamUUvOAmh27SXlbk1kOpi1XtjJIsd6BKCNy9crq8r0p4tN-3KKEqJXjVgvQR3AATdRFgexx0clfy-to6Of2O_-pFoNT3bos5Q858wNmrRfVHdKG8GpuXnvsm_ZIkhuIsTdNITH5nJbhX0u18XI1itJIMVb1ntnkKzH3y5TMSGoqB5GPa82cpRXzP9CaCKEE0e6XB57SQq_9q9_1", true,
						4.9, 64),
				createLabour("Srinivasulu T. Line Planting Crew (4 Pax)",
						List.of("Nursery Raising", "Line Transplanting", "Fertilizer Placement"),
						2000.0, 10, 4, "Mixed Crew",
						"Paddy Nursery & Systematic Line Transplanting Specialists. Ensures optimal hill spacing and root depth.",
						"4.2 km away • Makloor", "Dichpally", "Telangana", 18.57, 78.19,
						"+91 94401 33901",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCKwgWjhxLfLbeVAqFegEIZwlQZqF8yz4xtozvBdKg3K3Qm99_9aB59Hxt9mYZ3zKbIo5blRtnfDx2zquQ96WZDFlErvvFMOYGCTE-tPrOHxvrh61TcrT2j0L5FLtoveSOEI0GoNeQYaZikLQz8z4i3CzyZI9yFUoXsCnfRTEloN9uA7M51yvNSDOCKCTY9T73GxYPw7KXKqJC6jG33ojXBZN4at5cwYaMWo0lbWVam92botgWDYxyE", true,
						4.8, 42),
				createLabour("B. Satyanarayana Orchard Care Team (3 Pax)",
						List.of("Canopy Pruning", "Foliar Spraying", "Fruit Thinning", "Mulching"),
						1900.0, 14, 3, "Male",
						"Orchard Pruning & Spraying Team. Specialized in mango, citrus, and guava canopy thinning and pest containment.",
						"5.7 km away • Renjal", "Varni", "Telangana", 18.52, 77.91,
						"+91 94401 77219",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCZgk-PHNnXZBON3EuJ2sfjgAc-xKeNDmZIKsIUtg_sWv2Z-alSQOU51aoIhw7PI74cdVj4d1PXwSueAw8Jg7IpT-q7fa3r_yXL8JpPMnaoHyJltCmglARkafFE5hov4e2CC0NDMhNujyaBPiKYeLvji4As1sSCuNj973017AoCfkiCoQVS_GDaIWSqBaFfqp1FTZFFMoyY8eFqRiG8cp9pyev4y48wmx4vMxcgwE4MYEXem3wXDkmb", true,
						4.7, 39),
				createLabour("Raju Nayak Precision Spray Duo (2 Pax)",
						List.of("Boom Spraying", "Bio-Nutrients", "PPE Protocol", "Swath Calibration"),
						1400.0, 8, 2, "Male",
						"Boom Sprayer & Chemical Safety Specialists. Certified pesticide applicators with complete drift control and protective gear.",
						"6.0 km away • Balkonda", "Balkonda", "Telangana", 18.86, 78.34,
						"+91 94401 29811",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCZgk-PHNnXZBON3EuJ2sfjgAc-xKeNDmZIKsIUtg_sWv2Z-alSQOU51aoIhw7PI74cdVj4d1PXwSueAw8Jg7IpT-q7fa3r_yXL8JpPMnaoHyJltCmglARkafFE5hov4e2CC0NDMhNujyaBPiKYeLvji4As1sSCuNj973017AoCfkiCoQVS_GDaIWSqBaFfqp1FTZFFMoyY8eFqRiG8cp9pyev4y48wmx4vMxcgwE4MYEXem3wXDkmb", true,
						4.8, 84)
		);

		labourRepository.saveAll(crews);
	}

	private void initOperators() {
		if (operatorRepository.count() > 0) {
			return;
		}

		logger.info("Initializing 6 certified machinery operators from Stitch design...");

		List<Operator> operators = List.of(
				createOperator("Shiva Kumar", List.of("John Deere 5050D", "Paddy Harvester", "Laser Levelling", "Deep Tilling"),
						10, 900.0, "TS-16-OP-2018-0042",
						"Master Heavy Tractor & Harvester Operator. Certified heavy machine pilot with zero-damage track record across 4,000+ field hours.",
						"3.2 km away • Dharpally", "Dharpally", "Telangana", 18.54, 78.25,
						"+91 94401 82746",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCYm_A7Xzl9jJeovt579j7wrfvyTU3Tijoc1BevMTqaz61OZ9kBGZW6O73enQ506wJmPOWMIc3s3mVnjmj0yc0zB0T4YchhBL-iFywbKwPnONGWTa-lSykH3X7hUEnYt9bXmt21dm9QKUV9RVlFZG5PpQQDN8AtRwhcBq42wkX3L3suRqp8T-SUj5B5G198zt8qPdkCWswXHCU0PjTu0XTcT7t8i9PV3ilkMIK9PYQAARs0z1dRU9UZ",
						true, 4.9, 92),
				createOperator("G. Narsimha", List.of("Drip Manifolds", "Submersible Pumps", "Venturi Injectors", "Filter Backwash"),
						12, 800.0, "TS-16-OP-2015-0811",
						"Drip Irrigation & Sump Setup Specialist. Expert agronomical plumbing technician for subsurface line setup and solar pump sync.",
						"8.0 km away • Mopal", "Mopal", "Telangana", 18.62, 78.14,
						"+91 94401 77341",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCKwgWjhxLfLbeVAqFegEIZwlQZqF8yz4xtozvBdKg3K3Qm99_9aB59Hxt9mYZ3zKbIo5blRtnfDx2zquQ96WZDFlErvvFMOYGCTE-tPrOHxvrh61TcrT2j0L5FLtoveSOEI0GoNeQYaZikLQz8z4i3CzyZI9yFUoXsCnfRTEloN9uA7M51yvNSDOCKCTY9T73GxYPw7KXKqJC6jG33ojXBZN4at5cwYaMWo0lbWVam92botgWDYxyE",
						true, 4.7, 63),
				createOperator("Venkat Ramana", List.of("Subsoiler", "MB Plough", "Disc Harrow", "Hardpan Breakage"),
						11, 850.0, "TS-16-OP-2017-0349",
						"Deep Ploughing & Subsoiler Operator. Skilled in deep pan shatter, aerating root zones, and fuel-efficient tractor gear pacing.",
						"5.1 km away • Bodhan", "Banswada", "Telangana", 18.38, 77.88,
						"+91 94402 11984",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCYm_A7Xzl9jJeovt579j7wrfvyTU3Tijoc1BevMTqaz61OZ9kBGZW6O73enQ506wJmPOWMIc3s3mVnjmj0yc0zB0T4YchhBL-iFywbKwPnONGWTa-lSykH3X7hUEnYt9bXmt21dm9QKUV9RVlFZG5PpQQDN8AtRwhcBq42wkX3L3suRqp8T-SUj5B5G198zt8qPdkCWswXHCU0PjTu0XTcT7t8i9PV3ilkMIK9PYQAARs0z1dRU9UZ",
						true, 4.9, 51),
				createOperator("K. Balakrishna", List.of("Pneumatic Seeder", "Zero-Till Planter", "Seed Drill", "Fertilizer Placement"),
						8, 750.0, "TS-16-OP-2020-0443",
						"Seeder & Nursery Sowing Technician. Precision depth calibration for wheat, soybean, maize, and paddy direct seeding.",
						"6.8 km away • Varni", "Armoor", "Telangana", 18.795, 78.295,
						"+91 94402 33490",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCKwgWjhxLfLbeVAqFegEIZwlQZqF8yz4xtozvBdKg3K3Qm99_9aB59Hxt9mYZ3zKbIo5blRtnfDx2zquQ96WZDFlErvvFMOYGCTE-tPrOHxvrh61TcrT2j0L5FLtoveSOEI0GoNeQYaZikLQz8z4i3CzyZI9yFUoXsCnfRTEloN9uA7M51yvNSDOCKCTY9T73GxYPw7KXKqJC6jG33ojXBZN4at5cwYaMWo0lbWVam92botgWDYxyE",
						true, 4.8, 47),
				createOperator("M. Chandrashekhar", List.of("Combine Harvester", "Tracked Reaper", "Grain Thresher", "Baler"),
						13, 1200.0, "TS-16-OP-2014-0891",
						"Combine Thresher & Grain Separator Operator. Tracked combine master for swampy and lodged paddy fields with minimal drop loss.",
						"9.5 km away • Banswada", "Bodhan", "Telangana", 18.665, 77.89,
						"+91 94402 55102",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCYm_A7Xzl9jJeovt579j7wrfvyTU3Tijoc1BevMTqaz61OZ9kBGZW6O73enQ506wJmPOWMIc3s3mVnjmj0yc0zB0T4YchhBL-iFywbKwPnONGWTa-lSykH3X7hUEnYt9bXmt21dm9QKUV9RVlFZG5PpQQDN8AtRwhcBq42wkX3L3suRqp8T-SUj5B5G198zt8qPdkCWswXHCU0PjTu0XTcT7t8i9PV3ilkMIK9PYQAARs0z1dRU9UZ",
						true, 5.0, 78),
				createOperator("Ramesh Babu", List.of("Solar Inverters", "KUSUM Solar Pumps", "Descaling Emitters", "VFD Drive"),
						9, 850.0, "TS-16-OP-2019-0672",
						"Solar Pump & Micro-Irrigation Maintenance Engineer. Certified for 5HP/7.5HP KUSUM solar pump systems and automation controllers.",
						"8.4 km away • Navipet", "Navipet", "Telangana", 18.78, 78.02,
						"+91 94402 99401",
						"https://lh3.googleusercontent.com/aida-public/AB6AXuCKwgWjhxLfLbeVAqFegEIZwlQZqF8yz4xtozvBdKg3K3Qm99_9aB59Hxt9mYZ3zKbIo5blRtnfDx2zquQ96WZDFlErvvFMOYGCTE-tPrOHxvrh61TcrT2j0L5FLtoveSOEI0GoNeQYaZikLQz8z4i3CzyZI9yFUoXsCnfRTEloN9uA7M51yvNSDOCKCTY9T73GxYPw7KXKqJC6jG33ojXBZN4at5cwYaMWo0lbWVam92botgWDYxyE",
						true, 4.9, 58)
		);

		operatorRepository.saveAll(operators);
	}

	private Machinery createMachinery(String title, String category, String description, Integer hp, String fuel,
                        String width,
                        Double priceDay, Double priceHour, String address, String city, String state,
                        Double lat, Double lon, String ownerId, String ownerName, String ownerPhone,
                        List<String> images, boolean available, Double rating, Integer reviews) {
                Machinery m = new Machinery();
                m.setTitle(title);
                m.setCategory(category);
                m.setDescription(description);
                m.setHorsepower(hp);
                m.setFuelType(fuel);
                m.setWorkingWidth(width);
                m.setPricePerDay(priceDay);
                m.setPricePerHour(priceHour);
                m.setAddress(address);
                m.setCity(city);
                m.setState(state);
                m.setLatitude(lat);
                m.setLongitude(lon);
                m.setOwnerId(ownerId);
                m.setOwnerName(ownerName);
                m.setOwnerPhone(ownerPhone);
                m.setImages(images);
                m.setAvailable(available);
                m.setRating(rating);
                m.setReviewCount(reviews);
                return m;
        }

        private Seed createSeed(String name, String cropType, String variety, String desc, Double priceKg,
                        Double stockKg,
                        Double germRate, Integer maturityDays, String pkgSize, String address, String city,
                        String state,
                        Double lat, Double lon, String sellerId, String sellerName, String sellerPhone,
                        String imageUrl, boolean available, Double rating, Integer reviews) {
                Seed s = new Seed();
                s.setName(name);
                s.setCropType(cropType);
                s.setVariety(variety);
                s.setDescription(desc);
                s.setPricePerKg(priceKg);
                s.setStockKg(stockKg);
                s.setGerminationRate(germRate);
                s.setMaturityDays(maturityDays);
                s.setPackageSize(pkgSize);
                s.setAddress(address);
                s.setCity(city);
                s.setState(state);
                s.setLatitude(lat);
                s.setLongitude(lon);
                s.setSellerId(sellerId);
                s.setSellerName(sellerName);
                s.setSellerPhone(sellerPhone);
                s.setImageUrl(imageUrl);
                s.setAvailable(available);
                s.setRating(rating);
                s.setReviewCount(reviews);
                return s;
        }

        private Labour createLabour(String fullName, List<String> skills, Double dailyWage, Integer expYears,
                        Integer crewSize,
                        String gender, String bio, String address, String city, String state, Double lat, Double lon,
                        String phone, String avatar, boolean available, Double rating, Integer reviews) {
                Labour l = new Labour();
                l.setFullName(fullName);
                l.setSkills(skills);
                l.setDailyWage(dailyWage);
                l.setExperienceYears(expYears);
                l.setCrewSize(crewSize);
                l.setGender(gender);
                l.setBio(bio);
                l.setAddress(address);
                l.setCity(city);
                l.setState(state);
                l.setLatitude(lat);
                l.setLongitude(lon);
                l.setContactPhone(phone);
                l.setAvatarUrl(avatar);
                l.setAvailable(available);
                l.setRating(rating);
                l.setReviewCount(reviews);
                return l;
        }

        private Operator createOperator(String fullName, List<String> machineryExpertise, Integer expYears,
                        Double dailyWage,
                        String licenseNumber, String bio, String address, String city, String state,
                        Double lat, Double lon, String phone, String avatar, boolean available, Double rating,
                        Integer reviews) {
                Operator o = new Operator();
                o.setFullName(fullName);
                o.setMachineryExpertise(machineryExpertise);
                o.setExperienceYears(expYears);
                o.setDailyWage(dailyWage);
                o.setLicenseNumber(licenseNumber);
                o.setBio(bio);
                o.setAddress(address);
                o.setCity(city);
                o.setState(state);
                o.setLatitude(lat);
                o.setLongitude(lon);
                o.setContactPhone(phone);
                o.setAvatarUrl(avatar);
                o.setAvailable(available);
                o.setRating(rating);
                o.setReviewCount(reviews);
                return o;
        }
}
